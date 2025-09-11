const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware for sending email
const sendOrderMail = async (req, res, next) => {
  try {
    const { email, name, orderId, amount } = req.body;

    const mailOptions = {
      from: `"MyShop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Order Placed Successfully ✅",
      html: `
        <h2>Hello ${name},</h2>
        <p>Thank you for your purchase!</p>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Amount Paid:</b> ₹${amount}</p>
        <p>We will notify you once your order is shipped.</p>
        <br>
        <p>Regards,<br>MyShop Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Mail sent to:", email);
    next(); // आगे next route handler चलेगा
  } catch (error) {
    console.error("❌ Mail Error:", error);
    return res.status(500).json({ success: false, message: "Failed to send mail" });
  }
};

module.exports = { sendOrderMail };