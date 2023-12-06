const express = require('express');
const router = express.Router();
const JWT_OTP_Controller = require('../Controller/JWT_OTP_Controller');

// Route to send OTP via SMS
router.post('/send-otp', JWT_OTP_Controller.sendOTPController);
router.post('/verify-otp', JWT_OTP_Controller.verifyOTP);
router.post('/Logout', JWT_OTP_Controller.logout);

// Add routes for OTP verification if needed

module.exports = router;