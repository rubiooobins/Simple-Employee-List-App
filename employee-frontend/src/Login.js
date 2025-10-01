import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login({ onLogin, onShowRegister }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', form);
      setMessage('Login successful!');
      localStorage.setItem('token', res.data.token);
      onLogin(form.username);
    } catch (err) {
      setMessage(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🔒</div>
          <h2>Login</h2>
          <p>Sign in to your account</p>
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
                autoComplete="current-password"
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
            <span className="btn-text">Login</span>
            <span className="btn-glow"></span>
          </button>
          <div className="register-link-container">
            <button type="button" className="register-link-btn" onClick={onShowRegister}>
              Register
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

export default Login;
