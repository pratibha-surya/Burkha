const express = require('express');

const router = express.Router();
const userControler   = require('../controllers/RegitrationController');// Ensure correct spelling
const {  sendMailer } = require('../utils/mail');

// Define the registration route
router.post('/register', userControler.Registration ); // Explicitly define the route for registration
router.post('/login', userControler.Login);
router.post("/sendMail",sendMailer)


module.exports = router;