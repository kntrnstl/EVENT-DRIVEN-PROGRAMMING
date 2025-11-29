const express = require('express');
const router = express.Router();
const pool = require('../../db');
const adminAuth = require('../../middleware/adminAuth');
const authMiddleware = require('../../middleware/authMiddleware');

// Get all users (admin only)
router.get('/users', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET current user info (must be logged in)
router.get('/current-user', authMiddleware, async (req, res) => {
  try {
    const user = req.user; // injected by JWT middleware

    const [rows] = await pool.execute(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });

  } catch (error) {
    console.error("current-user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
