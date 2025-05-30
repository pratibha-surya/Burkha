const UserModel = require('../models/RegistrationModel');

const Order = require("../models/orderModel")

// const Payment = require('../models/payment.modal');
// Controller to handle user registration
const Registration = async (req, res) => {
  const {
    firmName,
    contactName,
    contactType,
    mobile1,
    mobile2,
    whatsapp,
    email,
    state,
    city,
    address,
    password,
    limit,
    discount
  } = req.body;

  try {
    const user = await UserModel.create({
      firmName,
      contactName,
      contactType,
      mobile1,
      mobile2,
      whatsapp,
      email,
      state,
      city,
      address,
      limit,
      password,
      discount
    });

    res.status(200).send("User successfully registered!");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("An error occurred during registration.");
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body, "fdfdfgd");
  // Check for required fields
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // // Compare plain-text passwords (⚠️ insecure, just for learning)
    // if (user.password !== password) {
    //   return res.status(401).json({ error: "Invalid email or password." });
    // }

    // Save minimal user info to session


    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
};

const getVendorById = async (req, res) => {
  try {
    const product = await Order.findById(req.params.id)
    // console.log(product,'aaaaaaaaaaaa')
    // RSRSRSconsole.log(product,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    if (!product) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};




















module.exports = {
  Registration,
  Login,
  getAllUsers,
  getVendorById

};
