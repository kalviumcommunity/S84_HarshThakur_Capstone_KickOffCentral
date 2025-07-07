const nodemailer = require('nodemailer');

/**
 * Creates and configures Nodemailer transporter for Gmail SMTP
 * @returns {object} Configured transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * Sends OTP email to the user
 * @param {string} to - Recipient email address
 * @param {string} otp - The OTP to send
 * @param {string} token - JWT token (optional, can be sent in response instead)
 * @returns {Promise<object>} Email sending result
 */
const sendOTPEmail = async (to, otp, token = null) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Your OTP Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">OTP Verification</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 16px; color: #555;">Your verification code is:</p>
          <h1 style="text-align: center; color: #007bff; font-size: 32px; margin: 20px 0; letter-spacing: 5px;">${otp}</h1>
          <p style="margin: 0; font-size: 14px; color: #666; text-align: center;">This code will expire in 5 minutes.</p>
        </div>
        <p style="font-size: 14px; color: #666; text-align: center;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Validates email configuration
 * @returns {boolean} True if email config is valid
 */
const validateEmailConfig = () => {
  return process.env.EMAIL_USER && process.env.EMAIL_PASS;
};

module.exports = {
  createTransporter,
  sendOTPEmail,
  validateEmailConfig
}; 