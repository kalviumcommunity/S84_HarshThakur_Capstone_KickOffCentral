const dotenv = require('dotenv');
dotenv.config();

const { generateOTP, createOTPToken, verifyOTPToken, isValidEmail } = require('./utils/otpUtils');

// Test OTP generation
console.log('Testing OTP generation...');
const otp = generateOTP();
console.log('Generated OTP:', otp);
console.log('OTP length:', otp.length);
console.log('Is 6 digits:', /^\d{6}$/.test(otp));

// Test email validation
console.log('\nTesting email validation...');
const testEmails = [
  'test@example.com',
  'invalid-email',
  'user@domain.co.uk',
  'test.email@subdomain.domain.com'
];

testEmails.forEach(email => {
  console.log(`${email}: ${isValidEmail(email) ? 'Valid' : 'Invalid'}`);
});

// Test JWT token creation and verification
console.log('\nTesting JWT token...');
const testEmail = 'test@example.com';
const token = createOTPToken(testEmail, otp);
console.log('Created token:', token.substring(0, 50) + '...');

// Test valid token verification
const decoded = verifyOTPToken(token);
console.log('Decoded token:', decoded);

// Test invalid token
const invalidToken = 'invalid.token.here';
const invalidDecoded = verifyOTPToken(invalidToken);
console.log('Invalid token result:', invalidDecoded);

console.log('\nAll tests completed!'); 