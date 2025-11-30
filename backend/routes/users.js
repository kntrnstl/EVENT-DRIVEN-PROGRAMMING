const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

// ============================
// AUTH MIDDLEWARE
// ============================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Basic decode (replace with full JWT verify if available)
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    req.user = { id: decoded.userId || decoded.id };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};


// ============================
// PROFILE ROUTES (MUST COME FIRST)
// ============================

// UPDATE OWN PROFILE
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('Profile update request for user:', userId, 'Data:', {
      username,
      email,
      currentPassword: !!currentPassword,
      newPassword: !!newPassword
    });

    // Fetch user
    const [userRows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // Verify current password
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password is required for updates" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (username && username !== user.username) {
      const [existingUser] = await pool.execute(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      updateFields.push('username = ?');
      updateValues.push(username);
    }

    if (email && email !== user.email) {
      const [existingEmail] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );

      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      updateFields.push('email = ?');
      updateValues.push(email);
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No changes detected" });
    }

    updateValues.push(userId);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.execute(query, updateValues);

    // Get fresh data
    const [updatedRows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: "Profile updated successfully",
      user: updatedRows[0]
    });

  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET CURRENT USER PROFILE
router.get('/profile/me', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users WHERE id = ?',
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ============================
// GENERIC USER ROUTES
// ============================

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
    await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
