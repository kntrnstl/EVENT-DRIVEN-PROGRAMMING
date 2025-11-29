const express = require('express');
const router = express.Router();
const pool = require('../db');

// FUZZY search helper
function fuzzy(str) {
  return `%${str.replace(/\s+/g, '%')}%`;
}

// SMART SEARCH + RANKING + RECOMMENDATIONS
router.get('/', async (req, res) => {
  const q = req.query.q || "";

  try {
    // MAIN product search (name, category, description)
    const [products] = await pool.execute(
      `
      SELECT 
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        c.name AS category,
        (
          (CASE WHEN p.name LIKE ? THEN 5 ELSE 0 END) +
          (CASE WHEN c.name LIKE ? THEN 3 ELSE 0 END) +
          (CASE WHEN p.description LIKE ? THEN 1 ELSE 0 END)
        ) AS score
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
        p.name LIKE ? OR 
        c.name LIKE ? OR
        p.description LIKE ?
      ORDER BY score DESC, p.price ASC
      `,
      [
        fuzzy(q), fuzzy(q), fuzzy(q),
        fuzzy(q), fuzzy(q), fuzzy(q)
      ]
    );

    // attach sizes
    for (let p of products) {
      const [sizes] = await pool.execute(
        `SELECT size, stock FROM product_sizes WHERE product_id=?`,
        [p.product_id]
      );
      p.sizes = sizes;
      p.out_of_stock = sizes.every(s => s.stock <= 0);
    }

    // "YOU MAY ALSO LIKE" = same category, random 4
    let recommended = [];
    if (products.length > 0) {
      const category = products[0].category;
      const [rec] = await pool.execute(
        `
        SELECT id AS product_id, name, price 
        FROM products
        WHERE category_id = (
          SELECT id FROM categories WHERE name=?
        )
        ORDER BY RAND() LIMIT 4
        `,
        [category]
      );
      recommended = rec;
    }

    res.json({
      query: q,
      results: products,
      recommended
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search error", error: err.message });
  }
});

module.exports = router;
