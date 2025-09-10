const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Product = require('../models/product.model');
const Vendor = require('../models/RegistrationModel');
const Cart = require('../models/cart.model');
const nodemailer=require('nodemailer')

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice, totalPriceAfterDiscount, vendor } = req.body;
  console.log(req.body);

  // ✅ Validate required fields
  if (
    !Array.isArray(orderItems) || orderItems.length === 0 ||
    totalPrice == null || totalPriceAfterDiscount == null ||
    !vendor
  ) {
    res.status(400);
    throw new Error('Missing required fields: orderItems, totalPrice, totalPriceAfterDiscount, or vendor');
  }

  // ✅ Fetch vendor details
  const vendorData = await Vendor.findById(vendor);
  
  if (!vendorData) {
    res.status(404);
    throw new Error(`Vendor not found: ${vendor}`);
  }

  // ✅ Fetch all previous orders to calculate outstanding dues
  const previousOrders = await Order.find({ vendor });
  const totalDueAmount = previousOrders.reduce((sum, order) => sum + (order.dueAmount || 0), 0);
  const newTotalDue = totalDueAmount + totalPriceAfterDiscount;

  if (vendorData.limit && newTotalDue > vendorData.limit) {
    res.status(400);
    throw new Error(`Vendor limit exceeded. Current due: ₹${totalDueAmount}, new order: ₹${totalPriceAfterDiscount}, limit: ₹${vendorData.limit}`);
  }

  // ✅ Validate each order item and check stock
  for (const item of orderItems) {
    const requiredFields = ['productId', 'productName', 'price', 'quantity', 'discountPercentage', 'priceAfterDiscount'];
    const missingField = requiredFields.find(f => item[f] === undefined || item[f] === null);
    if (missingField) {
      res.status(400);
      throw new Error(`Missing field "${missingField}" in order item`);
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.productName}`);
    }

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${item.productName}. Available: ${product.stock}`);
    }
  }

  // ✅ Construct the order
  const order = new Order({
    orderItems: orderItems.map(item => ({
      ...item,
      discountName: {
        _id: vendorData._id,
        firmName: vendorData.firmName,
        contactName: vendorData.contactName,
        mobile1: vendorData.mobile1,
        mobile2: vendorData.mobile2,
        whatsapp: vendorData.whatsapp,
        email: vendorData.email,
        address: vendorData.address,
        city: vendorData.city,
        state: vendorData.state,
        discount: vendorData.discount,
        limit: vendorData.limit
      }
    })),
    totalPrice,
    totalPriceAfterDiscount,
    dueAmount: totalPriceAfterDiscount,
    paymentStatus: 'pending',
    status: 'pending',
    vendor
  });

  // ✅ Save the order
  const savedOrder = await order.save();

  // ✅ Populate vendor in the saved order
  const populatedOrder = await Order.findById(savedOrder._id).populate('vendor');

  // ✅ Update product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity }
    });
  }

  // ✅ Clear cart (for all users or implement per-user logic if needed)
  await Cart.updateMany({}, { $set: { products: [] } });

  // ✅ Send response
  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order: populatedOrder
  });
});



// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  console.log(orders)
  res.status(200).json({
    success: true,
    orders
  });
});

// Get a single order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({
    success: true,
    order
  });
});

// Update an order
const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status, ...otherUpdates } = req.body;
  if (status) {
    order.status = status;
  }
  Object.assign(order, otherUpdates);

  const updatedOrder = await order.save();
  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order: updatedOrder
  });
});

// Delete an order
const deleteOrder = asyncHandler(async (req, res) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);
  if (!deletedOrder) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.status(200).json({
    success: true,
    message: 'Order deleted successfully',
    order: deletedOrder
  });
});

// Ship an order
const shipOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { remark, shippingDate } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status !== 'pending' && order.status !== 'confirmed') {
    res.status(400);
    throw new Error(`Order cannot be shipped from current status: ${order.status}`);
  }

  order.status = 'shipped';
  order.shippingDetails = {
    remark: remark || '',
    shippedAt: shippingDate || new Date()
  };

  const updatedOrder = await order.save();
  res.status(200).json({
    success: true,
    message: 'Order shipped successfully',
    order: updatedOrder
  });
});

// Deliver an order
const DilveredOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { deliveryDetails } = req.body;

  if (!deliveryDetails || !deliveryDetails.receivedBy || !deliveryDetails.remark) {
    res.status(400);
    throw new Error('Please provide delivery details including receivedBy and remark');
  }

  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.status === 'delivered') {
    res.status(400);
    throw new Error('Order is already delivered');
  }

  order.status = 'delivered';
  order.deliveryDetails = {
    receivedBy: deliveryDetails.receivedBy,
    remark: deliveryDetails.remark,
    deliveredAt: new Date()
  };

  const updatedOrder = await order.save();
  res.status(200).json({
    success: true,
    message: 'Order marked as delivered successfully',
    order: updatedOrder
  });
});

// Cancel an order
const CancelledOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = 'cancelled';
  order.cancellationReason = req.body.reason;
  const updatedOrder = await order.save();

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order: updatedOrder
  });
});

// Get all delivered orders
const getDeliveredOrders = asyncHandler(async (req, res) => {
  const deliveredOrders = await Order.find({ status: 'delivered' })
    .sort({ 'deliveryDetails.deliveredAt': -1 });
  res.status(200).json({
    success: true,
    count: deliveredOrders.length,
    orders: deliveredOrders
  });
});

// Get all shipped orders
const getShippedOrders = asyncHandler(async (req, res) => {
  const shippedOrders = await Order.find({ status: 'shipped' })
    .sort({ 'shippingDetails.shippedAt': -1 });
  res.status(200).json({
    success: true,
    orders: shippedOrders
  });
});

// Get all cancelled orders
const getCancelledOrders = asyncHandler(async (req, res) => {
  const cancelledOrders = await Order.find({ status: 'cancelled' })
    .sort({ updatedAt: -1 });
  res.status(200).json({
    success: true,
    orders: cancelledOrders
  });
});

// Get orders with due amount
const getOrdersWithDueAmount = asyncHandler(async (req, res) => {
  const hasDueAmount = req.params.hasDueAmount === 'true';
  const query = hasDueAmount ? { dueAmount: { $gt: 0 } } : {};
  const orders = await Order.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders: orders.map(order => ({
      ...order._doc,
      formattedId: `ORD-${order._id.toString().substring(0, 8).toUpperCase()}`
    }))
  });
});


const getMemberById = async (req, res) => {
  try {
    const {id} = req.params;
    if(! id) return res.status(401).json({success : false, message : "Please provide vendor ID"})
    const order = await Vendor.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.log(error.message)
  }
};





// controllers/orderController.js


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmailById = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Compose email content
    let orderItemsHtml = '';
    order.orderItems.forEach(item => {
      orderItemsHtml += `<li>${item.productName} - Qty: ${item.quantity} - Price: $${item.priceAfterDiscount || item.price}</li>`;
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'customer@example.com',  // Ideally get customer email from order schema
      subject: `Order Confirmation - Order #${order.formattedId || order._id}`,
      html: `
        <h2>Thank you for your purchase!</h2>
        <p>Order ID: ${order.formattedId || order._id}</p>
        <ul>${orderItemsHtml}</ul>
        <p>Total Price: $${order.totalPrice}</p>
        <p>Total after Discount: $${order.totalPriceAfterDiscount}</p>
        <p>Payment Status: ${order.paymentStatus}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Order confirmation email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};

 const getOrdersDueAmount = async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {};
    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const orders = await Order.find(filter)
      .populate('payments')
      .sort({ createdAt: -1 });

    const filteredOrders = orders
      .map(order => {
        const total = order.totalPriceAfterDiscount || 0;
        const paid = order.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const dueAmount = total - paid;

        return {
          ...order.toObject(),
          amount: paid,
          dueAmount: dueAmount >= 0 ? dueAmount : 0,
        };
      })
      .filter(order => order.dueAmount > 0); // Return only orders with dues

    res.json({ orders: filteredOrders });
  } catch (error) {
    console.error('Error fetching due amount orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  DilveredOrder,
  shipOrder,
  CancelledOrder,
  getDeliveredOrders,
  getShippedOrders,
  getCancelledOrders,
  getOrdersWithDueAmount,
  getMemberById,
  sendOrderEmailById,
  getOrdersDueAmount
};