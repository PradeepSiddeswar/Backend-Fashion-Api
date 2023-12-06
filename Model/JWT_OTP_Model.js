const mongoose = require('mongoose');

const jwt_otpSchema = new mongoose.Schema({
  mobileNumber: String,
  otp: String,
  createdAt: { type: Date, default: Date.now },
  refreshToken: { type: String },
});

const JWT_OTP= mongoose.model('JWT_OTP', jwt_otpSchema);

module.exports = JWT_OTP;