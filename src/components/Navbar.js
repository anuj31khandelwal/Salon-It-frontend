import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Salon-It!</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <a href="/">How It Works</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
        <Link to="/SignInPage">
          <button className="login-btn">Login</button>
        </Link>
        <Link to="/SignUpPage">
          <button className="register-btn">Register</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;