require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';
const JWT_EXPIRES_IN = '1d';

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN
}; 