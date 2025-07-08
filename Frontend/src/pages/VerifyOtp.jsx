import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setCookie } from '../utils/cookies';
import '../styles/VerifyOtp.css';

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, username, password, otpToken } = location.state || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handler for OTP input change
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length > 1) return; // Only allow one digit per box
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Move focus to next input if value entered
    if (value && idx < 5) {
      document.getElementById(`otp-input-${idx + 1}`).focus();
    }
    // Move focus to previous input if deleted
    if (!value && idx > 0) {
      document.getElementById(`otp-input-${idx - 1}`).focus();
    }
  };

  // Handler for backspace
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-input-${idx - 1}`).focus();
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    try {
      // 1. Verify OTP
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/otp/verify-otp`, { token: otpToken, otp: otpValue });
      // 2. Complete signup
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/signup`, { username, email, password });
      if (res.status === 200 || res.status === 201) {
        setSuccess('Signup successful! Redirecting to your favourites...');
        if (res.data.token) {
          setCookie('token', res.data.token, 7);
        }
        setTimeout(() => navigate('/favorites'), 1500);
      } else {
        setError(res.data.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to verify OTP or signup.');
      }
    }
  };

  if (!email || !username || !password) {
    return <div style={{ padding: 24 }}>Missing signup information. Please start from the signup page.</div>;
  }

  return (
    <div className="verifyotp-container">
      <form className="verifyotp-form" onSubmit={handleVerifyAndSignup}>
        <h2>Verify OTP</h2>
        <div style={{ marginBottom: 12 }}>OTP sent to <b>{email}</b></div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="otp-spinner" style={{ display: 'inline-block', marginBottom: 8 }}>
            <svg width="28" height="28" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#667eea">
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
          </div>
          <div style={{ color: '#b0b0b8', fontSize: '1.01rem' }}>
            Waiting for OTP email...<br/>
            <span style={{ fontSize: '0.97rem', color: '#888' }}>
              This may take a few seconds. Please check your inbox and spam/promotions folders.
            </span>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        <label>
          Enter OTP
          <div className="otp-input-group">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="otp-input"
                value={digit}
                onChange={e => handleOtpChange(e, idx)}
                onKeyDown={e => handleOtpKeyDown(e, idx)}
                autoFocus={idx === 0}
                required
              />
            ))}
          </div>
        </label>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
} 