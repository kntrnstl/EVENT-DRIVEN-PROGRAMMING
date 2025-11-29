const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all users — added status
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET single user — added status
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// UPDATE user — added status only
router.put('/:id', async (req, res, next) => {
  try {
    const { username, email, role, status } = req.body;

    await pool.execute(
      'UPDATE users SET username = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [username, email, role, status, req.params.id]
    );

    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE user
router.delete('/:id', async (req, res, next) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
