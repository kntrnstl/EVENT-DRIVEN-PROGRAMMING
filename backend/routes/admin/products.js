// backend/routes/admin/products.js
const express = require('express');
const router = express.Router();
const pool = require('../../db');
const adminAuth = require('../../middleware/adminAuth');

// =====================
// GET all products with category & sizes
// =====================
// backend/routes/admin/products.js
router.get('/', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
     SELECT 
  p.id AS product_id, 
  p.name, 
  p.description, 
  p.price, 
  c.id AS category_id,
  c.name AS category
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY p.id DESC

    `);

    // Fetch sizes for all products
    for (let product of rows) {
      const [sizes] = await pool.execute(
        'SELECT id, size, stock FROM product_sizes WHERE product_id=?',
        [product.product_id]
      );
      product.sizes = sizes; // attach sizes array
    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// =====================
// GET single product with sizes
// =====================
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT p.id, p.name, p.description, p.price, c.name AS category, p.created_at
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (products.length === 0) return res.status(404).json({ message: 'Product not found' });

    const [sizes] = await pool.execute(
      'SELECT id, size, stock FROM product_sizes WHERE product_id=?',
      [req.params.id]
    );

    res.json({ ...products[0], sizes });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// =====================
// CREATE product
// =====================
// POST - Add new product with base64 image
router.post('/',adminAuth, async (req, res) => {
  try {
    console.log('=== PRODUCT CREATION START ===');
    const { name, description, price, category_id, image } = req.body;
    
    console.log('Received fields:');
    console.log('- Name:', name);
    console.log('- Description length:', description ? description.length : 'NULL');
    console.log('- Price:', price);
    console.log('- Category ID:', category_id);
    console.log('- Image data:', image ? `Present (${image.length} characters)` : 'NULL');
    
    if (image) {
      console.log('- Image preview:', image.substring(0, 50) + '...');
    }

    // Validate required fields
    if (!name || !description || !price || !category_id) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log('Attempting database insert...');

    const [result] = await pool.execute(
      'INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, image]
    );

    console.log('Database insert successful, ID:', result.insertId);

    // Verify the data was inserted correctly
    const [verifyRows] = await pool.execute(
      'SELECT name, image IS NOT NULL as has_image FROM products WHERE id = ?',
      [result.insertId]
    );

    console.log('Verification query result:', verifyRows[0]);
    console.log('=== PRODUCT CREATION END ===');

    res.json({ 
      id: result.insertId,
      message: 'Product added successfully'
    });

  } catch (err) {
    console.error('=== PRODUCT CREATION ERROR ===');
    console.error('Error details:', err);
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('=== END ERROR ===');
    
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// =====================
// UPDATE product
// =====================
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    await pool.execute(
      'UPDATE products SET name=?, description=?, price=?, category_id=? WHERE id=?',
      [name, description, price, category_id || null, req.params.id]
    );

    const [updatedProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(updatedProduct[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// =====================
// DELETE product & sizes
// =====================
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM product_sizes WHERE product_id=?', [req.params.id]);
    await pool.execute('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// =====================
// SIZES MANAGEMENT
// =====================

// GET sizes for a product
router.get('/:id/sizes', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, size, stock FROM product_sizes WHERE product_id=?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ADD size for a product
router.post('/:id/sizes', adminAuth, async (req, res) => {
  try {
    const { size, stock } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)',
      [req.params.id, size, stock || 0]
    );
    res.status(201).json({ id: result.insertId, size, stock: stock || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// UPDATE size stock
router.put('/sizes/:sizeId', adminAuth, async (req, res) => {
  try {
    const { stock } = req.body;
    await pool.execute('UPDATE product_sizes SET stock=? WHERE id=?', [stock, req.params.sizeId]);
    res.json({ message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE size
router.delete('/sizes/:sizeId', adminAuth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM product_sizes WHERE id=?', [req.params.sizeId]);
    res.json({ message: 'Size deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});




module.exports = router;
