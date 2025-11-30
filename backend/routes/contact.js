const express = require("express");
const router = express.Router();
const transporter = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  try {

    await transporter.sendMail({
      from: `"ONING FLIP MAILER" <${process.env.EMAIL_USER}>`,
      
      /* Business inbox */
      to: process.env.EMAIL_USER,    // andreicaretas@gmail.com
      
      /* Reply directly to client */
      replyTo: email,

      subject: `📩 New Contact Message from ${name}`,

      html: `
        <h2>New Website Message</h2>
        <hr>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f7f7f7;padding:12px;border-radius:5px">
            ${message}
        </div>
      `
    });

    res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("MAIL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }
});

module.exports = router;
