import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './HowItWorks.module.css';

function HowItWorks() {
  const [activeView, setActiveView] = useState('customer'); // 'customer' or 'owner'
  
  return (
    <div className={styles.howItWorks}>
      <header className={styles.header}>
        <div className={styles.logo}>Salon-It!</div>
        <nav className={styles.navigation}>
          <Link to="/" className={styles.navLink}>Home</Link>
          <Link to="/Features" className={styles.navLink}>Features</Link>
          <Link to="/Testimonials" className={styles.navLink}>Testimonials</Link>
          <Link to="/FAQ" className={styles.navLink}>FAQ</Link>
          <Link to="/Contact" className={styles.navLink}>Contact</Link>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.heroSection}>
          <h1>How Salon-It! Works</h1>
          <p className={styles.subtitle}>
            Our platform makes booking and managing salon appointments simple and efficient for everyone involved.
          </p>
        </section>

        <div className={styles.contentContainer}>
          <section className={styles.customerSection}>
            <div className={styles.sectionHeader}>
              <h3>For Customers</h3>
            </div>
            
            <div className={styles.bookingProcess}>
              <h2>Easy Booking Process</h2>
              <p>Find your favorite salon, choose your preferred service and stylist, and book an appointment in just a few clicks.</p>
              
              <div className={styles.stepsContainer}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <div className={styles.stepContent}>
                    <h4>Browse Salons</h4>
                    <p>Search for salons by location, services, or ratings to find your perfect match.</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <div className={styles.stepContent}>
                    <h4>Select Service & Time</h4>
                    <p>Choose your preferred service, stylist, and appointment time from available slots.</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <div className={styles.stepContent}>
                    <h4>Confirm Booking</h4>
                    <p>Review your appointment details, make the payment if required, and receive confirmation.</p>
                  </div>
                </div>
                
                <div className={styles.step}>
                  <div className={styles.stepNumber}>4</div>
                  <div className={styles.stepContent}>
                    <h4>Manage Bookings</h4>
                    <p>View, reschedule, or cancel appointments from your personal dashboard.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <section className={styles.bookingPreview}>
            <div className={styles.windowHeader}>
              <div className={styles.windowControls}>
                <span className={`${styles.control} ${styles.red}`}></span>
                <span className={`${styles.control} ${styles.yellow}`}></span>
                <span className={`${styles.control} ${styles.green}`}></span>
              </div>
              <div className={styles.windowTitle}>Salon-It! - Customer Booking</div>
            </div>
            <div className={styles.windowContent}>
              <h3>Available Salons Near You</h3>
              
              <div className={styles.salonCard}>
                <div className={styles.salonInfo}>
                  <h4>Glamour Cuts</h4>
                  <p>123 Main Street</p>
                  <div className={styles.rating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.reviewCount}>(128)</span>
                  </div>
                </div>
                <div className={styles.salonBadge}>Popular</div>
              </div>
              
              <div className={styles.salonCard}>
                <div className={styles.salonInfo}>
                  <h4>Style Studio</h4>
                  <p>456 Oak Avenue</p>
                  <div className={styles.rating}>
                    <span className={styles.stars}>★★★★☆</span>
                    <span className={styles.reviewCount}>(96)</span>
                  </div>
                </div>
                <div className={`${styles.salonBadge} ${styles.new}`}>New</div>
              </div>
              <Link to="/">
              <button className={styles.continueBtn}>Continue Booking</button>
              </Link>
            </div>
          </section>
        </div>
        
        <section className={styles.featuresSection}>
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.clockIcon}`}>
              <i className={styles.iconClock}></i>
            </div>
            <h3>Real-Time Updates</h3>
            <p>Receive instant notifications about appointment confirmations, changes, or reminders to stay informed.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.dashboardIcon}`}>
              <i className={styles.iconDashboard}></i>
            </div>
            <h3>Comprehensive Dashboard</h3>
            <p>Access a personalized dashboard with all your relevant information organized for easy management.</p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={`${styles.featureIcon} ${styles.securityIcon}`}>
              <i className={styles.iconSecurity}></i>
            </div>
            <h3>Secure Authentication</h3>
            <p>User data and transactions are protected with state-of-the-art security measures and encryption.</p>
          </div>
        </section>
        
        <section className={styles.salonOwnersSection}>
          <div className={styles.sectionContent}>
            <h2>For Salon Owners and Barbers</h2>
            <p>Our platform provides powerful tools for salon owners and barbers to manage appointments, track earnings, and streamline operations.</p>
            
            <div className={styles.ownerFeatures}>
              <div className={styles.featureRow}>
                <div className={styles.ownerFeature}>
                  <div className={styles.featureCheck}>✓</div>
                  <div>
                    <h4>Appointment Management</h4>
                    <p>View and update the status of all appointments from a central dashboard.</p>
                  </div>
                </div>
                
                <div className={styles.ownerFeature}>
                  <div className={styles.featureCheck}>✓</div>
                  <div>
                    <h4>Staff Management</h4>
                    <p>Add, update, or manage your salon's barbers and stylists easily.</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.featureRow}>
                <div className={styles.ownerFeature}>
                  <div className={styles.featureCheck}>✓</div>
                  <div>
                    <h4>Revenue Tracking</h4>
                    <p>Monitor earnings by date ranges with detailed financial reports.</p>
                  </div>
                </div>
                
                <div className={styles.ownerFeature}>
                  <div className={styles.featureCheck}>✓</div>
                  <div>
                    <h4>Service Configuration</h4>
                    <p>Set up and customize your service offerings, prices, and durations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.ownerDashboardPreview}>
            <div className={styles.dashboardCard}>
              <div className={styles.cardHeader}>
                <h4>Salon Dashboard</h4>
                <span className={styles.viewToggle}>Owner View</span>
              </div>
              
              <div className={styles.dashboardStats}>
                <div className={styles.statItem}>
                  <h4>Today's Appointments</h4>
                  <div className={styles.statValueContainer}>
                    <span className={styles.statValue}>12</span>
                    <span className={`${styles.statChange} ${styles.positive}`}>+3 from yesterday</span>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <h4>Revenue (Last 7 Days)</h4>
                  <div className={styles.statValueContainer}>
                    <span className={styles.statValue}></span>
                  </div>
                </div>
              </div>
              
              <div className={styles.quickActions}>
                <h4>Quick Actions</h4>
                <div className={styles.actionButtons}>
                  <button className={`${styles.actionBtn} ${styles.addBtn}`}>Add Barber</button>
                  <button className={`${styles.actionBtn} ${styles.updateBtn}`}>Update Status</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HowItWorks;