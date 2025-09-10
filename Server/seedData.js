const mongoose = require('mongoose');
const Order = require('./models/orderModel');
const Vendor = require('./models/RegistrationModel');
const Product = require('./models/product.model');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany({});
    await Vendor.deleteMany({});
    await Product.deleteMany({});

    console.log('Cleared existing data');

    // Create sample vendor
    const vendor = new Vendor({
      firmName: "Sample Vendor Ltd",
      contactName: "John Doe",
      mobile1: "9876543210",
      mobile2: "9876543211",
      whatsapp: "9876543210",
      email: "john@samplevendor.com",
      address: "123 Business Street",
      city: "Mumbai",
      state: "Maharashtra",
      discount: 10,
      limit: 50000
    });
    await vendor.save();
    console.log('Created vendor:', vendor.firmName);

    // Create sample products
    const products = [
      {
        name: "Cotton T-Shirt",
        price: 299,
        stock: 100,
        category: "Clothing",
        images: ["https://via.placeholder.com/150"],
        description: "Comfortable cotton t-shirt"
      },
      {
        name: "Denim Jeans",
        price: 899,
        stock: 50,
        category: "Clothing",
        images: ["https://via.placeholder.com/150"],
        description: "Classic denim jeans"
      },
      {
        name: "Running Shoes",
        price: 1299,
        stock: 30,
        category: "Footwear",
        images: ["https://via.placeholder.com/150"],
        description: "Comfortable running shoes"
      },
      {
        name: "Leather Jacket",
        price: 2499,
        stock: 20,
        category: "Clothing",
        images: ["https://via.placeholder.com/150"],
        description: "Premium leather jacket"
      }
    ];

    const savedProducts = [];
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      savedProducts.push(product);
      console.log('Created product:', product.name);
    }

    // Create sample orders
    const orders = [
      {
        orderItems: [
          {
            productId: savedProducts[0]._id,
            productName: "Cotton T-Shirt",
            price: 299,
            quantity: 2,
            productImage: "https://via.placeholder.com/150",
            discountPercentage: 5,
            priceAfterDiscount: 284.05,
            discountName: {
              _id: vendor._id,
              firmName: vendor.firmName,
              contactName: vendor.contactName,
              mobile1: vendor.mobile1,
              mobile2: vendor.mobile2,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              address: vendor.address,
              city: vendor.city,
              state: vendor.state,
              discount: vendor.discount,
              limit: vendor.limit
            }
          }
        ],
        totalPrice: 598,
        totalPriceAfterDiscount: 568.10,
        dueAmount: 568.10,
        paymentStatus: 'pending',
        status: 'pending',
        vendor: vendor._id
      },
      {
        orderItems: [
          {
            productId: savedProducts[1]._id,
            productName: "Denim Jeans",
            price: 899,
            quantity: 1,
            productImage: "https://via.placeholder.com/150",
            discountPercentage: 10,
            priceAfterDiscount: 809.10,
            discountName: {
              _id: vendor._id,
              firmName: vendor.firmName,
              contactName: vendor.contactName,
              mobile1: vendor.mobile1,
              mobile2: vendor.mobile2,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              address: vendor.address,
              city: vendor.city,
              state: vendor.state,
              discount: vendor.discount,
              limit: vendor.limit
            }
          }
        ],
        totalPrice: 899,
        totalPriceAfterDiscount: 809.10,
        dueAmount: 809.10,
        paymentStatus: 'partially_paid',
        status: 'shipped',
        vendor: vendor._id
      },
      {
        orderItems: [
          {
            productId: savedProducts[2]._id,
            productName: "Running Shoes",
            price: 1299,
            quantity: 1,
            productImage: "https://via.placeholder.com/150",
            discountPercentage: 15,
            priceAfterDiscount: 1104.15,
            discountName: {
              _id: vendor._id,
              firmName: vendor.firmName,
              contactName: vendor.contactName,
              mobile1: vendor.mobile1,
              mobile2: vendor.mobile2,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              address: vendor.address,
              city: vendor.city,
              state: vendor.state,
              discount: vendor.discount,
              limit: vendor.limit
            }
          }
        ],
        totalPrice: 1299,
        totalPriceAfterDiscount: 1104.15,
        dueAmount: 0,
        paymentStatus: 'paid',
        status: 'delivered',
        vendor: vendor._id
      },
      {
        orderItems: [
          {
            productId: savedProducts[0]._id,
            productName: "Cotton T-Shirt",
            price: 299,
            quantity: 3,
            productImage: "https://via.placeholder.com/150",
            discountPercentage: 0,
            priceAfterDiscount: 299,
            discountName: {
              _id: vendor._id,
              firmName: vendor.firmName,
              contactName: vendor.contactName,
              mobile1: vendor.mobile1,
              mobile2: vendor.mobile2,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              address: vendor.address,
              city: vendor.city,
              state: vendor.state,
              discount: vendor.discount,
              limit: vendor.limit
            }
          },
          {
            productId: savedProducts[3]._id,
            productName: "Leather Jacket",
            price: 2499,
            quantity: 1,
            productImage: "https://via.placeholder.com/150",
            discountPercentage: 20,
            priceAfterDiscount: 1999.20,
            discountName: {
              _id: vendor._id,
              firmName: vendor.firmName,
              contactName: vendor.contactName,
              mobile1: vendor.mobile1,
              mobile2: vendor.mobile2,
              whatsapp: vendor.whatsapp,
              email: vendor.email,
              address: vendor.address,
              city: vendor.city,
              state: vendor.state,
              discount: vendor.discount,
              limit: vendor.limit
            }
          }
        ],
        totalPrice: 3396,
        totalPriceAfterDiscount: 2896.20,
        dueAmount: 2896.20,
        paymentStatus: 'pending',
        status: 'pending',
        vendor: vendor._id
      }
    ];

    for (const orderData of orders) {
      const order = new Order(orderData);
      await order.save();
      console.log('Created order:', order._id);
    }

    console.log('✅ Sample data seeded successfully!');
    console.log(`Created ${savedProducts.length} products`);
    console.log(`Created ${orders.length} orders`);
    console.log('Created 1 vendor');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
if (require.main === module) {
  seedData();
}

module.exports = seedData;

