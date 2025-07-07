# OTP Email Verification Setup Guide

## Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
# Email Configuration for Gmail SMTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# JWT Secret for token signing
JWT_SECRET=your-super-secret-jwt-key-here

# Database Configuration (if needed for other features)
MONGODB_URI=mongodb://localhost:27017/your-database

# Server Configuration
PORT=5000
```

## Gmail Setup Instructions

### 1. Create a Dedicated Gmail Account
- Create a new Gmail account specifically for sending emails
- Enable 2-factor authentication on this account

### 2. Generate App Password
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this 16-character password as your `EMAIL_PASS`

### 3. Update .env File
Replace the placeholder values in your `.env` file:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: The app password generated above
- `JWT_SECRET`: A strong random string for JWT signing

## API Endpoints

### POST /otp/send-otp
Sends OTP to user's email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "token": "jwt-token-here"
}
```

### POST /otp/verify-otp
Verifies the OTP entered by user.

**Request Body:**
```json
{
  "token": "jwt-token-from-send-otp",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

## Features

- ✅ Stateless OTP verification (no database required)
- ✅ JWT token with 5-minute expiry
- ✅ Secure email sending via Gmail SMTP
- ✅ Input validation and error handling
- ✅ Clean, modular code organization
- ✅ Async/await syntax throughout
- ✅ Comprehensive error messages

## Security Features

- JWT tokens expire after 5 minutes
- Email validation before sending
- Secure token verification
- No OTP storage in database
- Proper error handling for invalid/expired tokens

## Testing

You can test the API using tools like Postman or curl:

```bash
# Send OTP
curl -X POST http://localhost:5000/otp/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/otp/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"token": "your-jwt-token", "otp": "123456"}'
``` 