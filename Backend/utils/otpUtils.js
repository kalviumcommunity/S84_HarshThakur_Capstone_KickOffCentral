const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

console.log("OTPUTILS JWT_SECRET is:", process.env.JWT_SECRET);

/**
 * Generates a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Creates a JWT token containing the OTP with 5-minute expiry
 * @param {string} email - User's email address
 * @param {string} otp - The generated OTP
 * @returns {string} JWT token
 */
const createOTPToken = (email, otp) => {
  const payload = {
    email,
    otp,
    type: 'otp_verification'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
};

/**
 * Verifies and decodes the JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} Decoded token payload or null if invalid
 */
const verifyOTPToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  generateOTP,
  createOTPToken,
  verifyOTPToken,
  isValidEmail
};
