require('dotenv').config();
const express = require('express');
const router = express.Router();
const { 
  generateOTP, 
  createOTPToken, 
  verifyOTPToken, 
  isValidEmail 
} = require('../utils/otpUtils');
const { sendOTPEmail, validateEmailConfig } = require('../utils/mailConfig');

/**
 * POST /send-otp
 * Sends OTP to user's email address
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check email configuration
    if (!validateEmailConfig()) {
      return res.status(500).json({
        success: false,
        message: 'Email service is not configured properly'
      });
    }

    // Generate OTP and token
    const otp = generateOTP();
    const token = createOTPToken(email, otp);

    // Send email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      token: token // Sending token in response for frontend to use
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

/**
 * POST /verify-otp
 * Verifies the OTP entered by user
 */
router.post('/verify-otp', async (req, res) => {
  try {
    const { token, otp } = req.body;

    // Validate input
    if (!token || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Token and OTP are required'
      });
    }

    // Verify JWT token
    const decoded = verifyOTPToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if token is for OTP verification
    if (decoded.type !== 'otp_verification') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Verify OTP
    if (decoded.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      email: decoded.email
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

module.exports = router; 