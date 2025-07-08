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
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    if (form.username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      // Check if user exists (by email or username)
      const checkRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/check-user`, { email: form.email, username: form.username });
      if (checkRes.data.exists) {
        setError(
          checkRes.data.field === 'email'
            ? 'A user with this email already exists. Please log in or use a different email.'
            : 'Username already taken. Please choose another.'
        );
        setLoading(false);
        return;
      }
      // Send OTP if user does not exist
      // Navigate to verify-otp page with form data and OTP token
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/otp/send-otp`, { email: form.email });
      navigate('/verify-otp', { state: { ...form, otpToken: res.data.token } });
      setLoading(false);
    } catch (err) {
      if (err.response?.data?.field === 'email') {
        setError('A user with this email already exists. Please log in or use a different email.');
      } else if (err.response?.data?.field === 'username') {
        setError('Username already taken. Please choose another.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
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
        <button type="submit" disabled={loading}>
          {loading ? (
            <span>
              <svg width="18" height="18" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff" style={{ verticalAlign: 'middle', marginRight: 6 }}>
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="3">
                    <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite" />
                    </path>
                  </g>
                </g>
              </svg>
              Sending OTP...
            </span>
          ) : (
            'Send OTP'
          )}
        </button>

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