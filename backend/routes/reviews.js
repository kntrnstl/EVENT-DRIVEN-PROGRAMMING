// routes/reviews.js
const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')

// GET reviews for a specific product - SIMPLE VERSION
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews] = await pool.execute(`
      SELECT * FROM reviews 
      WHERE product_id = ? 
      ORDER BY created_at DESC
    `, [productId]);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST review - KEEP YOUR EXISTING CODE
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { product_id, rating, comment } = req.body;

    // Validate input
    if (!product_id || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    // Check if user has purchased this product (delivered status)
    const [orders] = await pool.execute(`
      SELECT o.* 
      FROM orders o 
      JOIN order_items oi ON o.id = oi.order_id 
      WHERE o.user_id = ? AND o.status = 'delivered' AND oi.product_id = ?
    `, [userId, product_id]);

    if (orders.length === 0) {
      return res.status(403).json({ message: 'You need to purchase and receive this product first before reviewing' });
    }

    // Check if user already reviewed this product
    const [existingReview] = await pool.execute(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingReview.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Insert review
    await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, product_id, rating, comment]
    );

    res.json({ message: 'Review submitted successfully!' });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router