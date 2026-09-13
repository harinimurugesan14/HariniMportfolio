import React, { useState } from 'react';
import './Login.css';

function AdminLogin() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log('Admin login:', { adminId, password });
  };

  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admin ID:</label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
