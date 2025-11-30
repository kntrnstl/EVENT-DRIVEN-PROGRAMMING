require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // andreicaretas@gmail.com
    pass: process.env.EMAIL_PASS    // Gmail App Password
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err);
  } else {
    console.log("✅ Email server ready to send messages");
  }
});

module.exports = transporter;
