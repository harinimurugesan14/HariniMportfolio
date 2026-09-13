import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Mobile App Store</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/customer-login">Customer Login</Link></li>
        <li><Link to="/admin-login">Admin Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
