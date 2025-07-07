import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'; // ✅ fixed import
import { setCookie, getCookie } from '../utils/cookies';

export default function Login() {
  const [form, setForm] = useState({
    username: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.username.length < 3) {
      setError('Please enter a valid username');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        form
      );
      setSuccess('Login successful!');
      setForm({ username: '', password: '' });

      // Save token in cookie if provided
      if (res.data.token) {
        setCookie('token', res.data.token, 7); // 7 days expiry
      }

      // After login, go to home page
      navigate('/home');
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user:", decoded); // 👁️ View: name, email, sub

      // Send the token to backend for verification / session
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/google`, {
        token: credentialResponse.credential,
      });

      // Save token in cookie if provided
      if (res.data.token) {
        setCookie('token', res.data.token, 7); // 7 days expiry
      }

      setSuccess('Google login successful!');
      
      // After Google login, go to home page
      navigate('/home');
    } catch (err) {
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
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

        <button type="submit">Log In</button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0 4px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          <span style={{ margin: '0 8px', color: '#888', fontSize: '0.95em' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 0, marginTop: 0 }}>
          <GoogleLogin
            text="continue_with"
            onSuccess={handleGoogleLogin}
            onError={() => setError('Google login failed')}
          />
        </div>
      </form>
    </div>
  );
}