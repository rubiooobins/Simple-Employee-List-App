import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Register({ onShowLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/signup', form);
      setMessage('Registration successful!');
    } catch (err) {
      setMessage(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">📝</div>
          <h2>Register</h2>
          <p>Create a new account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
                placeholder=" "
              />
              <label>Username</label>
              <span className="input-line"></span>
            </div>
          </div>
          <div className="form-group password-wrapper">
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder=" "
              />
              <label>Password</label>
              <span className="input-line"></span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                <span className="toggle-icon" />
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">
            <span className="btn-text">Register</span>
            <span className="btn-glow"></span>
          </button>
          <div className="register-link-container">
            <button type="button" className="register-link-btn" onClick={onShowLogin}>
              Go to Login
            </button>
          </div>
          {message && <p className={message.includes('success') ? 'success-message show' : 'error-message show'}>{message}</p>}
        </form>
      </div>
      <div className="background-effects">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>
    </div>
  );
}

export default Register;
