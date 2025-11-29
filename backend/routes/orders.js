const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const paypal = require('@paypal/checkout-server-sdk');

// PayPal environment setup - ADD THIS AT THE TOP
let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
let client = new paypal.core.PayPalHttpClient(environment);

// KEEP YOUR EXISTING CODE EXACTLY AS IS
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { items, total, payment_method, address } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    if (!payment_method)
      return res.status(400).json({ message: "Payment method required" });

    if (!address)
      return res.status(400).json({ message: "Address is required" });

    // Insert order
    const [orderResult] = await pool.execute(
      `INSERT INTO orders (user_id, total, status, payment_method, address)
       VALUES (?, ?, 'pending', ?, ?)`,
      [userId, total, payment_method, address]
    );

    const orderId = orderResult.insertId;

    // Insert items + update stock
    for (const item of items) {

      await pool.execute(
        `INSERT INTO order_items (order_id, product_id, size_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.size_id, item.quantity, item.price]
      );

      await pool.execute(
        `UPDATE product_sizes 
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.size_id]
      );
    }

    // Clear user cart
    await pool.execute(
      "DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)",
      [userId]
    );

    res.json({ 
      message: "Order placed successfully!",
      order_id: orderId 
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE THESE PAYPAL ENDPOINTS - REAL PAYPAL INTEGRATION:

// Create PayPal Order - WITH DEBUG LOGGING
router.post("/paypal/create", async (req, res) => {
  try {
    console.log('PayPal Create Order Request:', req.body);
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { items, total, discount_amount, discount_id, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create REAL PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    
    const finalAmount = (total - (discount_amount || 0)).toFixed(2);
    
    console.log('Creating PayPal order for amount:', finalAmount);
    
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "PHP",
          value: finalAmount
        },
        description: "Product Purchase"
      }],
      application_context: {
        brand_name: "Your Store",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-success`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`
      }
    });

    console.log('Sending PayPal request...');
    const paypalOrder = await client.execute(request);
    console.log('PayPal order created:', paypalOrder.result.id);
    
    res.json({
      orderID: paypalOrder.result.id,
      status: paypalOrder.result.status
    });

  } catch (err) {
    console.error("PayPal Create Order Error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ 
      message: "Failed to create PayPal order", 
      error: err.message 
    });
  }
});

// Capture PayPal Payment - FIXED WITH 'preparing' STATUS
router.post("/paypal/capture", async (req, res) => {
  try {
    console.log('PayPal Capture Request - OrderID:', req.body.orderID);
    console.log('Request body:', req.body);
    
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { orderID, items, total, discount_amount, discount_id, address } = req.body;

    if (!orderID) {
      return res.status(400).json({ message: "PayPal Order ID is required" });
    }

    // VALIDATE ADDRESS
    if (!address || address.trim() === '') {
      return res.status(400).json({ 
        message: "Delivery address is required for PayPal orders" 
      });
    }

    console.log('Capturing PayPal payment for order:', orderID);
    console.log('Address:', address);
    
    // Capture REAL PayPal payment
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    console.log('PayPal capture result:', capture.result.status);

    if (capture.result.status !== "COMPLETED") {
      return res.status(400).json({ 
        message: "Payment not completed", 
        status: capture.result.status 
      });
    }

    // USE 'preparing' STATUS FOR PAYPAL ORDERS
    const orderStatus = 'preparing';

    // FIXED: Correct SQL with proper parameter order
    const [orderResult] = await pool.execute(
      `INSERT INTO orders (user_id, total, status, payment_method, address, paypal_order_id, discount_amount, discount_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,                    // user_id
        total,                     // total
        orderStatus,               // status - 'preparing'
        'paypal',                  // payment_method
        address,                   // address
        orderID,                   // paypal_order_id
        discount_amount || 0,      // discount_amount
        discount_id || null        // discount_id
      ]
    );

    const orderId = orderResult.insertId;
    console.log('Order created successfully with ID:', orderId);

    // Insert items + update stock
    for (const item of items) {
      console.log('Inserting order item:', item);
      
      await pool.execute(
        `INSERT INTO order_items (order_id, product_id, size_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.size_id, item.quantity, item.price]
      );

      await pool.execute(
        `UPDATE product_sizes 
         SET stock = stock - ?
         WHERE id = ?`,
        [item.quantity, item.size_id]
      );
    }

    // Clear user cart
    await pool.execute(
      "DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)",
      [userId]
    );

    console.log('=== PAYPAL PAYMENT COMPLETED SUCCESSFULLY ===');
    
    res.json({
      message: "Payment captured and order created successfully!",
      order_id: orderId,
      paypal_order_id: orderID,
      status: "COMPLETED"
    });

  } catch (err) {
    console.error("PayPal Capture Error:", err);
    console.error("Error details:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      message: "Failed to capture payment", 
      error: err.message,
      details: err.toString() 
    });
  }
});

// ADD THIS USER ORDERS ENDPOINT AT THE END
// GET /api/orders/user (get user's orders for reviews validation)
router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [orders] = await pool.execute(`
      SELECT o.*, 
             oi.product_id, oi.size_id, oi.quantity, oi.price,
             p.name as product_name, ps.size_name
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_sizes ps ON oi.size_id = ps.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // Group items by order
    const ordersWithItems = orders.reduce((acc, row) => {
      let order = acc.find(o => o.id === row.id);
      if (!order) {
        order = {
          id: row.id,
          total: row.total,
          status: row.status,
          payment_method: row.payment_method,
          address: row.address,
          created_at: row.created_at,
          items: []
        };
        acc.push(order);
      }
      
      if (row.product_id) {
        order.items.push({
          product_id: row.product_id,
          product_name: row.product_name,
          size: row.size_name,
          quantity: row.quantity,
          price: row.price
        });
      }
      
      return acc;
    }, []);

    res.json(ordersWithItems);
  } catch (err) {
    console.error("Get user orders error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;