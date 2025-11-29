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
app.use(express.json());

app.use(express.json({ limit: '50mb' })); // Increase from default 100kb to 10mb
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Default route
app.get('/', (req, res) => res.send({ message: 'API running...' }));

// Routes
app.use('/api/admin', adminRouter);
app.use('/api/users', usersRouter);
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
app.use('/api/reviews', require('./routes/reviews'));

// ADD THIS - Current user for regular users (no admin middleware)
app.get('/api/current-user', require('./middleware/authMiddleware'), async (req, res) => {
  try {
    const pool = require('./db');
    const [rows] = await pool.execute(
      'SELECT id, username, email, role, created_at, status FROM users WHERE id = ?',
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (err) {
    console.error('User profile fetch error:', err);
    res.status(500).json({ message: "Server error" });
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
