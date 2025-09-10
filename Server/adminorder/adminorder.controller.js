const OrderModel = require("../models/PaymentModule");
const getAllOrders = async (req, res) => {
  try {
    const orders = await Payments.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Payments .findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 module.exports={getAllOrders}