import React, { useState, useEffect } from 'react';
import { Link,useParams,useLocation } from 'react-router-dom';
import api from '../api';
import './UserDashboard.css';
import { Clock, Calendar, Heart, Edit, X } from 'lucide-react';

const UserDashboard = () => {
  const { userId } = useParams();
  const location = useLocation();
  const storedUserId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [pastAppointments, setPastAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState('');

  const validUserId = userId || storedUserId;

  useEffect(() => {
    if (validUserId) {
      if (location.state?.userName) {
        setUsername(location.state.userName); // Set username from state
      }
      fetchAppointments(validUserId); // Always fetch appointments
    } else {
      console.error("User ID not found. Please log in again.");
      setError("User ID not found. Please log in again.");
      setLoading(false);
    }
  }, [validUserId, location.state]);

  // Fetch appointments from API
      const fetchAppointments = async (userId) => {
      try {
      const response = await api.get(`/api/users/${userId}/dashboard`);        
        
      setUsername(response.data.username || 'Guest');
        setPastAppointments(response.data.pastAppointments || []);
        setUpcomingAppointments(response.data.upcomingAppointments || []);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      }
    };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  // Function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Choose appointments based on active tab
  const displayedAppointments = activeTab === 'Upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="dashboard-container">
      {/* Navbar component */}
      <nav className="navbar">
        <div className="logo">Salon-It!</div>
        <div className="nav-links">
          <Link to="/SelectLocation">Book Appointment</Link>
          <Link to="/Features">Features</Link>
          <Link to="/HowItWorks">How It Works</Link>
          <Link to="/Testimonials">Testimonials</Link>
          <Link to="/FAQ">FAQ</Link>
          <Link to="/Contact">Contact</Link>
        </div>
      </nav>

      {/* Main dashboard card */}
      <div className="dashboard-card">
        {/* Dashboard header */}
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h2 className="dashboard-name">Customer Dashboard</h2>
            <p className="dashboard-description">Manage your appointments and preferences</p>
          </div>
          <div className="dashboard-header-right">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <p className="user-name">{location.state?.userName}</p>
              <p className="user-type">Premium Member</p>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="dashboard-nav">
          <button 
            className={`nav-item ${activeTab === 'Upcoming' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`nav-item ${activeTab === 'Past' ? 'active' : ''}`} 
            onClick={() => setActiveTab('Past')}
          >
            Past
          </button>
        </div>

        {/* Dashboard stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-header">
              <span>Upcoming</span>
              <Calendar className="stat-icon" size={20} />
            </div>
            <div className="stat-value">{upcomingAppointments.length}</div>
            <a href="#" className="stat-link">View all upcoming</a>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Past</span>
              <Clock className="stat-icon" size={20} />
            </div>
            <div className="stat-value">{pastAppointments.length}</div>
            <a href="#" className="stat-link">View history</a>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span>Favorite Salons</span>
              <Heart className="stat-icon" size={20} fill="currentColor" />
            </div>
            <div className="stat-value">4</div>
            <a href="#" className="stat-link fav-link">Manage favorites</a>
          </div>
        </div>

        {/* Appointment list */}
        <div className="appointment-list">
          {displayedAppointments.length > 0 ? (
            displayedAppointments.map(appointment => (
              <div key={appointment.id} className="appointment-item">
                <div className="appointment-date">
                  <div className="month">{formatDate(appointment.appointmentTime).split(' ')[0]}</div>
                  <div className="day">{formatDate(appointment.appointmentTime).split(' ')[1]}</div>
                </div>

                <div className="appointment-details">
                  <h3 className="appointment-service">{appointment.serviceName}</h3>
                  <p className="appointment-time">
                    <Clock size={14} />
                    {formatTime(appointment.appointmentTime)}
                  </p>
                  <p className="appointment-location">
                    <Calendar size={14} />
                    {appointment.customerName}
                  </p>
                </div>

                <div className="appointment-actions">
                  <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                  {appointment.status !== 'COMPLETED' && (
                    <>
                      <button className="action-button edit">
                        <Edit size={16} />
                      </button>
                      <button className="action-button cancel">
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-appointments">No {activeTab.toLowerCase()} appointments found.</p>
          )}
        </div>

        {/* Load more button */}
        <div className="load-more-container">
          <button className="load-more-button">Load More</button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
