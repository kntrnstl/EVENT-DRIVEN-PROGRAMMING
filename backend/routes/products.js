const express = require('express')
const router = express.Router()
const pool = require('../db')
const jwt = require('jsonwebtoken')

// GET all products with categories and sizes (public)
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.execute(`
      SELECT p.id AS product_id, p.name, p.description, p.price, p.image, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `)

    // attach sizes for each product
    for (let product of products) {
      const [sizes] = await pool.execute(
        'SELECT id, size, stock FROM product_sizes WHERE product_id=?',
        [product.product_id]
      )
      product.sizes = sizes
    }

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET single product with sizes (public)
router.get('/:id', async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT p.id AS product_id, p.name, p.description, p.price, p.image, c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    )
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' })

    const [sizes] = await pool.execute(
      'SELECT id, size, stock FROM product_sizes WHERE product_id=?',
      [req.params.id]
    )

    res.json({ ...products[0], sizes })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET product reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const [reviews] = await pool.execute(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = ? 
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router