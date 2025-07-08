import axios from 'axios';
import React, { useState } from 'react';
import '../styles/Signup.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ use named import
import { setCookie, getCookie } from '../utils/cookies';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Navigate to verify-otp page with form data (no OTP token)
    navigate('/verify-otp', { state: { ...form } });
  };

  const handleGoogleSignup = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Send to backend for account creation/login
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/google`, {
        token: credentialResponse.credential,
      });

      // Save token in cookie if provided
      if (res.data.token) {
        setCookie('token', res.data.token, 7); // 7 days expiry
      }

      setSuccess('Signed up successfully with Google!');
      navigate('/favorites');
    } catch (err) {
      setError('Google signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSendOtp}>
        <h2>Create Account</h2>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            minLength={3}
            placeholder="Enter username"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            placeholder="Enter password"
          />
        </label>
        <button type="submit">Send OTP</button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 4px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          <span style={{ margin: '0 8px', color: '#888', fontSize: '0.95em' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0, marginTop: 0 }}>
          <GoogleLogin
            text="continue_with"
            onSuccess={handleGoogleSignup}
            onError={() => setError('Google signup failed')}
          />
        </div>
      </form>
    </div>
  );
}