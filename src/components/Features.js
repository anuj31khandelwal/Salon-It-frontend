import React from 'react';
import './Features.css';

const Features = () => {
  return (
    <div className="salon-app">
      <header className="header">
        <div className="logo">
          <h1>Salon-It!</h1>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <section className="features-section">
        <h2>Powerful Features for Everyone</h2>
        <p className="features-description">
          Salon-It! provides specialized tools for customers, salon owners, and barbers to streamline the entire booking process.
        </p>

        <div className="features-container">
          <div className="feature-card">
            <div className="icon-container customer-icon">
              <i className="user-icon"></i>
            </div>
            <h3>For Customers</h3>
            <ul className="feature-list">
              <li><span className="check-icon"></span>Easy appointment booking</li>
              <li><span className="check-icon"></span>View past and upcoming appointments</li>
              <li><span className="check-icon"></span>Service ratings and reviews</li>
              <li><span className="check-icon"></span>Real-time notifications</li>
            </ul>
            <div className="register-link">
              <a href="#register-customer">Register as Customer <span className="arrow">→</span></a>
            </div>
          </div>

          <div className="feature-card">
            <div className="icon-container owner-icon">
              <i className="salon-icon"></i>
            </div>
            <h3>For Salon Owners</h3>
            <ul className="feature-list">
              <li><span className="check-icon"></span>Manage all bookings (pending, upcoming, past)</li>
              <li><span className="check-icon"></span>Update barber information</li>
              <li><span className="check-icon"></span>Track earnings by date (7 days, 30 days, 1 year)</li>
              <li><span className="check-icon"></span>Update appointment status</li>
            </ul>
            <div className="register-link">
              <a href="#register-owner">Register as Salon Owner <span className="arrow">→</span></a>
            </div>
          </div>

          <div className="feature-card">
            <div className="icon-container barber-icon">
              <i className="barber-user-icon"></i>
            </div>
            <h3>For Barbers</h3>
            <ul className="feature-list">
              <li><span className="check-icon"></span>View all bookings (pending, upcoming, past)</li>
              <li><span className="check-icon"></span>Update appointment status</li>
              <li><span className="check-icon"></span>Manage personal availability</li>
              <li><span className="check-icon"></span>Receive notification alerts</li>
            </ul>
            <div className="register-link">
              <a href="#register-barber">Register as Barber <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;