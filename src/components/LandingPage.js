import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="salon-container">
      <nav className="navbar">
        <div className="logo">Salon-It!</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/Features">Features</Link>
          <Link to="/HowItWorks">How It Works</Link>
          <Link to="/SalonRegistration">Partner with Us</Link>
          <Link to="/FAQ">FAQ</Link>
          <Link to="/Contact">Contact</Link>
          <Link to="/SignInPage">
            <button className="login-btn">Login</button>
          </Link>
          <Link to="/SignUpPage">
            <button className="register-btn">Register</button>
          </Link>
        </div>
      </nav>

      <div className="main-content">
        <div className="hero-section">
          <h1>
            Book Your <span className="highlight">Perfect</span>
            <br />
            Salon Experience
          </h1>
          <p className="hero-text">
            Salon-It! connects you with top stylists and salons. Book
            appointments, manage your schedule, and enjoy a seamless
            salon experience.
          </p>
          <div className="cta-buttons">
            <Link to="/SignInPage">
              <button className="book-now-btn">Book Now</button>
            </Link>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div className="user-info">
            <div className="avatar-group">
              <div className="avatar avatar-1">JI</div>
              <div className="avatar avatar-2">A</div>
              <div className="avatar avatar-3">H</div>
              <div className="avatar avatar-more">+</div>
            </div>
            <span className="joined-text">Joined by 1,200+ satisfied customers this month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
