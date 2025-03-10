import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './SalonDashboard.css';

const AppointmentsTab = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardData, setDashboardData] = useState({
    pendingAppointments: [],
    upcomingAppointments: [],
    pastAppointments: [],
    earnings: {
      last7Days: 0,
      last30Days: 0,
      last1Year: 0
    }
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments from API
  const salonId = localStorage.getItem('salonId') || 1;

  useEffect(() => {
    setLoading(true);
    api.get(`/api/salons/${salonId}/dashboard`)
      .then((response) => {
        setDashboardData(response.data);
        
        // Set appointments based on active filter
        updateAppointmentsList(response.data, activeFilter);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, [salonId]);

  // Update appointments list when filter changes
  useEffect(() => {
    updateAppointmentsList(dashboardData, activeFilter);
  }, [activeFilter, dashboardData]);

  const updateAppointmentsList = (data, filter) => {
    let filteredAppointments = [];
    
    switch(filter) {
      case 'Pending':
        filteredAppointments = data.pendingAppointments || [];
        break;
      case 'Upcoming':
        filteredAppointments = data.upcomingAppointments || [];
        break;
      case 'Past':
        filteredAppointments = data.pastAppointments || [];
        break;
      case 'All':
      default:
        filteredAppointments = [
          ...(data.pendingAppointments || []),
          ...(data.upcomingAppointments || []),
          ...(data.pastAppointments || [])
        ];
    }
    
    setAppointments(filteredAppointments);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'PENDING':
        return 'status-pending';
      default:
        return '';
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="appointments-container">
      <div className="appointments-header">
        <h2>Appointments</h2>
        <div className="filter-buttons">
          {['All', 'Pending', 'Upcoming', 'Past'].map((filter) => (
            <button
              key={filter}
              className={activeFilter === filter ? 'active' : ''}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading appointments data...</div>
      ) : (
        <div className="appointments-table">
          <div className="table-header">
            <div className="header-cell client-col">CLIENT</div>
            <div className="header-cell service-col">SERVICE</div>
            <div className="header-cell barber-col">BARBER</div>
            <div className="header-cell datetime-col">DATE & TIME</div>
            <div className="header-cell status-col">STATUS</div>
            <div className="header-cell actions-col">ACTIONS</div>
          </div>

          {appointments.length === 0 ? (
            <div className="no-data">No appointments found</div>
          ) : (
            appointments.map((appointment) => (
              <div className="table-row" key={appointment.id}>
                <div className="cell client-col" data-label="CLIENT">
                  <div className="client-avatar">{appointment.customerName?.substring(0, 2).toUpperCase()}</div>
                  <div className="client-info">
                    <div className="client-name">{appointment.customerName}</div>
                    <div className="client-email">{appointment.customerEmail || 'No email provided'}</div>
                  </div>
                </div>
                <div className="cell service-col" data-label="SERVICE">
                  <div className="service-name">{appointment.serviceName}</div>
                  <div className="service-duration">{appointment.duration || '30'} min</div>
                </div>
                <div className="cell barber-col" data-label="BARBER">
                  {appointment.barberName || 'Any available'}
                </div>
                <div className="cell datetime-col" data-label="DATE & TIME">
                  {formatDate(appointment.appointmentTime)}
                </div>
                <div className="cell status-col" data-label="STATUS">
                  <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="cell actions-col" data-label="ACTIONS">
                  <button className="edit-btn">Edit</button>
                  <button className="cancel-btn">Cancel</button>
                </div>
              </div>
            ))
          )}

          <div className="table-footer">
            <div className="showing-info">Showing {appointments.length} appointments</div>
            <div className="pagination">
              <button className="page-btn">Prev</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Staff Management Component
const StaffManagementTab = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const salonId = localStorage.getItem('salonId') || 1;

  useEffect(() => {
    setLoading(true);
    api.get(`/api/salons/barbers?salonId=${salonId}`)
      .then((response) => {
        const staffData = response.data.map((name) => ({
          name,
          appointmentCount: Math.floor(Math.random() * 7), // Random count for demo
        }));
        setStaffMembers(staffData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching barbers:', error);
        setLoading(false);
      });
  }, [salonId]);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  // Generate a color based on initials
  const getInitialsColor = (initials) => {
    const colors = ['#e74c3c', '#3498db', '#8e44ad', '#27ae60', '#f39c12', '#16a085'];
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Helper function for appointment count styling
  const getAppointmentClass = (appointmentCount) => {
    if (appointmentCount >= 6) return 'high-appointments';
    if (appointmentCount >= 4) return 'medium-appointments';
    return '';
  };
  
  return (
    <div className="staff-container">
      <div className="staff-header">
        <h2>Staff Management</h2>
        <button className="add-staff-btn">
          <span className="plus-icon">+</span> Add New Barber
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading staff data...</div>
      ) : (
        <div className="staff-cards">
          {staffMembers.length === 0 ? (
            <div className="no-data">No staff members found</div>
          ) : (
            staffMembers.map(staff => {
              const initials = getInitials(staff.name);
              return (
                <div className="staff-card" key={staff.id}>
                  <div className="staff-card-header">
                    <div className="staff-initials" style={{ backgroundColor: getInitialsColor(initials) }}>
                      {initials}
                    </div>
                    <div className="staff-actions">
                      <button className="edit-staff-btn">✏️</button>
                      <button className="delete-staff-btn">✕</button>
                    </div>
                  </div>
                  
                  <div className="staff-info">
                    <h3 className="staff-name">{staff.name}</h3>
                    <p className="staff-role">{staff.role || 'Barber'}</p>
                    
                    <div className="staff-contact">
                      <div className="contact-item">
                        <span className="contact-icon">📱</span>
                        <span className="contact-value">{staff.phone || 'Not provided'}</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">✉️</span>
                        <span className="contact-value">{staff.email || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div className="staff-status-container">
                      <div className={`staff-status ${staff.status === 'Active' ? 'status-active' : 'status-off'}`}>
                        {staff.status || 'Active'}
                      </div>
                      <div className={`staff-appointments ${getAppointmentClass(staff.appointmentCount || 0)}`}>
                        {staff.appointmentCount ? `Today: ${staff.appointmentCount} appointments` : 'No appointments today'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

const SalonDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeRange, setTimeRange] = useState('7 Days');
  const [dashboardData, setDashboardData] = useState({
    pendingAppointments: [],
    upcomingAppointments: [],
    pastAppointments: [],
    earnings: {
      last7Days: 0,
      last30Days: 0,
      last1Year: 0
    }
  });
  const [loading, setLoading] = useState(true);

  const salonId = localStorage.getItem('salonId') || 1;

  // Fetch dashboard data from API
  useEffect(() => {
    setLoading(true);
    api.get(`/api/salons/${salonId}/dashboard`)
      .then((response) => {
        setDashboardData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, [salonId]);

  const getEarningsForTimeRange = () => {
    switch(timeRange) {
      case '7 Days':
        return dashboardData.earnings.last7Days;
      case '30 Days':
        return dashboardData.earnings.last30Days;
      case '1 Year':
        return dashboardData.earnings.last1Year;
      default:
        return dashboardData.earnings.last7Days;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="dashboard-content">
            {loading ? (
              <div className="loading">Loading dashboard data...</div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <h3>{`${timeRange} Revenue`}</h3>
                      <span className="icon revenue-icon">💰</span>
                    </div>
                    <div className="stat-value">${getEarningsForTimeRange().toFixed(2)}</div>
                    <div className="stat-change positive">
                      <span>↑ 12.5%</span> <span className="change-period">from last period</span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <h3>Pending Appointments</h3>
                      <span className="icon appointments-icon">📅</span>
                    </div>
                    <div className="stat-value">{dashboardData.pendingAppointments.length}</div>
                    <div className="stat-alert">
                      {dashboardData.pendingAppointments.length > 5 ? '⚠️ High number of pending appointments' : ''}
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <h3>Upcoming Appointments</h3>
                      <span className="icon appointments-icon">⏰</span>
                    </div>
                    <div className="stat-value">{dashboardData.upcomingAppointments.length}</div>
                    <div className="stat-info">
                      Next: {dashboardData.upcomingAppointments[0]?.appointmentTime ? 
                        formatDate(dashboardData.upcomingAppointments[0].appointmentTime) : 'None'}
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <h3>Completed Appointments</h3>
                      <span className="icon appointments-icon">✅</span>
                    </div>
                    <div className="stat-value">
                      {dashboardData.pastAppointments.filter(app => app.status === 'COMPLETED').length}
                    </div>
                    <div className="stat-change positive">
                      <span>↑ 8.2%</span> <span className="change-period">from last week</span>
                    </div>
                  </div>
                </div>

                <div className="analytics-section">
                  <div className="section-header">
                    <h3>Revenue Overview</h3>
                    <div className="time-filter">
                      {['7 Days', '30 Days', '1 Year'].map((range) => (
                        <button
                          key={range}
                          className={timeRange === range ? 'active' : ''}
                          onClick={() => setTimeRange(range)}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="revenue-overview">
                    <div className="total-revenue">
                      <h4>Total Revenue</h4>
                      <p>Period: {timeRange}</p>
                      <div className="stat-value">${getEarningsForTimeRange().toFixed(2)}</div>
                      <div className="revenue-change positive">
                        <span className="change-icon">↑</span> 15.3% <span className="change-period">vs previous period</span>
                      </div>
                    </div>
                    
                    <div className="chart-container">
                      <div className="chart-placeholder">
                        {/* Chart would go here */}
                      </div>
                      <div className="days-of-week">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                    
                    <div className="service-breakdown">
                      <div className="service-card">
                        <h4>Haircuts</h4>
                        <div className="service-value">$1,245.00</div>
                        <div className="service-change positive">+12.3%</div>
                      </div>
                      <div className="service-card">
                        <h4>Beard Trims</h4>
                        <div className="service-value">$685.50</div>
                        <div className="service-change positive">+8.7%</div>
                      </div>
                      <div className="service-card">
                        <h4>Styling</h4>
                        <div className="service-value">$423.00</div>
                        <div className="service-change negative">-2.1%</div>
                      </div>
                      <div className="service-card">
                        <h4>Products</h4>
                        <div className="service-value">$312.75</div>
                        <div className="service-change positive">+22.5%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'Appointments':
        return <AppointmentsTab />;
      case 'Staff':
        return <StaffManagementTab />;
      case 'Services':
        return <div className="dashboard-content">Services management content goes here</div>;
      case 'Earnings':
        return <div className="dashboard-content">Earnings and revenue analytics go here</div>;
      case 'Settings':
        return <div className="dashboard-content">Settings content goes here</div>;
      default:
        return <div className="dashboard-content">Welcome to your dashboard!</div>;
    }
  };

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="salon-dashboard">
      <div className="dashboard-container">
        <div className="navbar">
          <div className="logo">Salon-It!</div>
          <div className="nav-links">
            {['Overview', 'Appointments', 'Staff', 'Services', 'Earnings', 'Settings'].map(
              (tab) => (
                <a
                  key={tab}
                  href="#"
                  className={activeTab === tab ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                >
                  {tab}
                </a>
              )
            )}
          </div>
        </div>

        <div className="dashboard-header">
          <div className="header-info">
            <h2>Salon Dashboard</h2>
            <p>Manage your salon's appointments, staff, and more</p>
          </div>
          <div className="salon-info">
            <div className="avatar">{salonId.toString().substring(0, 2).toUpperCase()}</div>
            <div className="salon-details">
              <p className="salon-name">Beautiful Cuts</p>
              <p className="salon-type">Hair Salon</p>
            </div>
          </div>
        </div>

        <div className="dashboard-nav">
          <ul>
            {['Overview', 'Appointments', 'Staff', 'Services', 'Earnings', 'Settings'].map(
              (tab) => (
                <li
                  key={tab}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </li>
              )
            )}
          </ul>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default SalonDashboard;