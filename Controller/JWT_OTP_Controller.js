const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const JWT_OTP = require('../Model/JWT_OTP_Model');
const accountSid = 'ACe7095109a4c0dd3313b18eade9848c90';
const authToken = 'dee23c3ca59e3c496f42a03c6e6a1036';

const twilioClient = twilio(accountSid, authToken);
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

// Function to send OTP via Twilio
async function sendOTP(mobileNumber, otp) {
  try {
    // Send the OTP via SMS using Twilio
    await twilioClient.messages.create({
      body: `Your OTP for verification is: ${otp}`,
      from: '+14252767599',
      to: mobileNumber,
    });
    return true; // SMS sent successfully
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false; // SMS sending failed
  }
}

// Controller function to send OTP and generate JWT
exports.sendOTPController = async (req, res) => {
  const { mobileNumber } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP in the database (you need to create the OTP model for this)
    const otpRecord = new JWT_OTP({ mobileNumber, otp });
    await otpRecord.save();

    // Send OTP via SMS
    const smsSent = await sendOTP(mobileNumber, otp);

    if (smsSent) {
      // Generate JWT token with phone number as a claim
      const token = jwt.sign({ mobileNumber }, secretKey, { expiresIn: '1h' });

      res.status(200).json({ message: 'OTP sent successfully', 
      otp,
      token });
    } else {
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}


// Controller function to verify OTP
exports.verifyOTP = async (req, res) => {
    const {  otp } = req.body;
  
    try {
      // Find the OTP record in the database
      const otpRecord = await JWT_OTP.findOne({ otp });
  
      if (!otpRecord) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  
exports.logout = async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Assuming you have a RefreshToken model or schema
        const existingRefreshToken = await JWT_OTP.findOne({ token: refreshToken });

        if (!existingRefreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Invalidate the refresh token or perform other actions
        await existingRefreshToken.save();

        return res.status(200).json({ message: 'Refresh token invalidated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
