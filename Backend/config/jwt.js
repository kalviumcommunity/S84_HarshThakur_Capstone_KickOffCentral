require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-for-development';
const JWT_EXPIRES_IN = '1d';

module.exports = {
    SECRET_KEY,
    JWT_EXPIRES_IN
}; 