require('dotenv').config();
const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const productAdminRouter = require('./routes/admin/products');
const categoryAdminRouter = require('./routes/admin/categories');
const publicProductsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');
const adminOrdersRouter = require('./routes/admin/orders');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Default route
app.get("/", (req, res) => {
  res.send({ message: "API running..." });
});

/* ROUTES */
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter); // This includes the profile routes now
app.use('/api/auth', authRouter);
app.use('/api/admin/products', productAdminRouter);
app.use('/api/admin/categories', categoryAdminRouter);
app.use('/api/products', publicProductsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin/orders', adminOrdersRouter);

app.use("/api/orders/my", require("./routes/myOrders"));
app.use("/api/admin/reports", require("./routes/admin/reports"));
app.use("/api/search", require("./routes/search"));
app.use("/api/reviews", require("./routes/reviews"));

/* ✅ CONTACT EMAIL ROUTE */
app.use("/api/contact", require("./routes/contact"));

/* CURRENT USER */
app.get("/api/current-user", require("./middleware/authMiddleware"), async (req, res) => {
  try {
    const pool = require("./db");
    const [rows] = await pool.execute(
      "SELECT id, username, email, role, created_at, status FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });

  } catch (err) {
    console.error("User profile fetch:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADDED: Profile routes - make sure these are included in your usersRouter
// If they're not, you can add them directly here:
const authenticateToken = require("./middleware/authMiddleware");

// Profile routes
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log('Profile update request for user:', userId);

    const pool = require("./db");
    
    // Get current user data
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

    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Prepare update data
    const updateFields = [];
    const updateValues = [];

    if (username && username !== user.username) {
      // Check if username already exists
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
      // Check if email already exists
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

    // If no changes to make
    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No changes detected" });
    }

    // Update user
    updateValues.push(userId);
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    
    await pool.execute(query, updateValues);

    // Get updated user data (without password)
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

// Get current user profile
app.get('/api/users/profile/me', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const pool = require("./db");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});