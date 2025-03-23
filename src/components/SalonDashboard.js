import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import api from '../api';
import './SalonDashboard.css';
import { Clock, Check,Calendar,Edit, X } from 'lucide-react';

const SalonDashboard = () => {
  const { salonId } = useParams();
  const location = useLocation();
  const storedSalonId = localStorage.getItem("salonId") || 1;
  const [filter, setFilter] = useState('All'); // Move filter state here
  const [currentPage, setCurrentPage] = useState(1); // Move pagination state here

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
  const [staffMembers, setStaffMembers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salonName, setSalonName] = useState('');

  const validSalonId = salonId || storedSalonId;

  useEffect(() => {
    if (validSalonId) {
      if (location.state?.salonName) {
        setSalonName(location.state.salonName); 
      }
      fetchDashboardData(validSalonId);
    } else {
      console.error("Salon ID not found. Please log in again.");
      setError("Salon ID not found. Please log in again.");
      setLoading(false);
    }
  }, [validSalonId, location.state]);

  // Fetch staff data when the Staff tab is activated
  useEffect(() => {
    if (activeTab === 'Staff' && validSalonId) {
      fetchStaffData(validSalonId);
    }
  }, [activeTab, validSalonId]);

  // Fetch services data when the Services tab is activated
  useEffect(() => {
    if (activeTab === 'Services' && validSalonId) {
      fetchServicesData(validSalonId);
    }
  }, [activeTab, validSalonId]);

  const fetchDashboardData = async (salonId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/salons/${salonId}/dashboard`);
      setSalonName(response.data.salonName || 'Beautiful Cuts');
      setDashboardData({
        pendingAppointments: response.data.pendingAppointments || [],
        upcomingAppointments: response.data.upcomingAppointments || [],
        pastAppointments: response.data.pastAppointments || [],
        earnings: response.data.earnings || {
          last7Days: 0,
          last30Days: 0,
          last1Year: 0
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError("Error fetching dashboard data.");
      setLoading(false);
    }
  };

  const fetchStaffData = async (salonId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/salons/barbers/${salonId}`);
      setStaffMembers(Array.isArray(response.data) ? response.data : []);
      console.log("Staff Members when set:", staffMembers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
      setError("Error fetching staff data.");
      setLoading(false);
    }
  };

  const fetchServicesData = async (salonId) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/salons/${salonId}/services`);
      setServices(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services data:', error);
      setError("Error fetching services data.");
      setLoading(false);
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

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

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

   
  const getStatusClass = (status) => {
    switch(status) {
      case 'COMPLETED':
        return 'status-completed';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'PENDING':
        return 'status-pending';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };
  
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
  
  const AppointmentActions = ({ salonId, appointmentId, currentStatus, onStatusUpdate }) => {
    console.log("AppointmentActions received props:", { salonId, appointmentId, currentStatus });
  
    const normalizedStatus = currentStatus ? currentStatus.toUpperCase() : "PENDING";
    console.log("Normalized Status:", normalizedStatus);
  
    const updateStatus = async (newStatus) => {
      try {
        const response = await api.put(`/api/salons/${salonId}/appointments/${appointmentId}/status`, {
          status: newStatus,
        });
  
        alert(response.data);
        onStatusUpdate(); // Refresh data after update
      } catch (error) {
        console.error(`Error updating status to ${newStatus}:`, error.response?.data || error.message);
        alert(error.response?.data || `Failed to update status to ${newStatus}`);
      }
    };
  
    return (
      <div className="appointment-actions">
        {normalizedStatus === "PENDING" && (
          <button
            className="action-button accept"
            onClick={() => updateStatus("CONFIRMED")}
            title="Accept appointment"
          >
            <Check size={16} />
          </button>
        )}
  
        {(normalizedStatus === "PENDING" || normalizedStatus === "CONFIRMED") && (
          <button
            className="action-button cancel"
            onClick={() => updateStatus("CANCELLED")}
            title="Cancel appointment"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  };

  const renderAppointmentsTab = () => {
    // const [filter, setFilter] = useState('All'); // Default filter is "All"
    // const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
  
    let allAppointments = [
      ...dashboardData.upcomingAppointments,
      ...dashboardData.pendingAppointments,
      ...dashboardData.pastAppointments,
    ];
  
    // Sort appointments by date in descending order (latest first)
    allAppointments.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime));
  
    // Apply filtering based on toggle selection
    let filteredAppointments = allAppointments;
    if (filter === 'Upcoming') {
      filteredAppointments = dashboardData.upcomingAppointments;
    } else if (filter === 'Pending') {
      filteredAppointments = dashboardData.pendingAppointments;
    } else if (filter === 'Past') {
      filteredAppointments = dashboardData.pastAppointments;
    }
  
    // Pagination logic
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
    const paginatedAppointments = filteredAppointments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    return (
      <div className="appointments-container">
        <div className="appointments-header">
          <h2>Appointments</h2>
          <div className="filter-buttons">
            {['All', 'Upcoming', 'Pending', 'Past'].map((option) => (
              <button
                key={option}
                className={filter === option ? 'active' : ''}
                onClick={() => { setFilter(option); setCurrentPage(1); }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
  
        {loading ? (
          <div className="loading">Loading appointments data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="appointments-table">
            <div className="table-header">
              <div className="header-cell client-col">CLIENT</div>
              <div className="header-cell service-col">SERVICE</div>
              <div className="header-cell datetime-col">DATE & TIME</div>
              <div className="header-cell status-col">STATUS</div>
              <div className="header-cell actions-col">ACTIONS</div>
            </div>
  
            {paginatedAppointments.length === 0 ? (
              <div className="no-data">No appointments found</div>
            ) : (
              paginatedAppointments.map((appointment) => (
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
                  <div className="cell datetime-col" data-label="DATE & TIME">
                    {formatDate(appointment.appointmentTime)}
                  </div>
                  <div className="cell status-col" data-label="STATUS">
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="cell actions-col" data-label="ACTIONS">
                    <AppointmentActions 
                      salonId={salonId || validSalonId} 
                      appointmentId={appointment.id} 
                      currentStatus={appointment.status}
                      onStatusUpdate={() => fetchDashboardData(validSalonId)} 
                    />
                  </div>
                </div>
              ))
            )}
  
            {/* Pagination Controls */}
            <div className="table-footer">
              <div className="pagination">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Prev
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  

  const renderOverviewTab = () => {
    console.log("Staff Members:",{staffMembers});
    return (
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <div className="stats-container">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Pending Approvals</div>
                <div className="stat-value">{dashboardData.pendingAppointments.length}</div>
                <div className="stat-trend warning">⚠️ Needs attention</div>
              </div>
            </div>

            {/* Active Barbers Card */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Active Barbers</div>
                <div className="stat-value">{staffMembers.length}</div>
                <div className="stat-trend positive">👥 Full staff today</div>
              </div>
            </div>

            {/* Today's Revenue Card */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-label">Today's Revenue</div>
                <div className="stat-value">Rs.{dashboardData.earnings.last7Days > 0 ? 680 : 0}</div>
                <div className="stat-trend positive">+15% from last week</div>
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
                  <div className="stat-value">Rs. {getEarningsForTimeRange().toFixed(2)}</div>
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
              </div>
            </div>

            <div className="appointment-list">
              <h3>Recent Appointments</h3>
              {dashboardData.upcomingAppointments.slice(0, 3).map(appointment => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-container">
                  <div className="appointment-date">
                    <div className="month">{formatDateShort(appointment.appointmentTime).split(' ')[0]}</div>
                    <div className="day">{formatDateShort(appointment.appointmentTime).split(' ')[1]}</div>
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

                  {/* <div className="appointment-actions">
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
                  </div> */}
                </div>
              </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderStaffTab = () => {
    return (
      <div className="staff-container">
        <div className="staff-header">
          <h2>Staff Management</h2>
          <Link to={`/AddBarber/${salonId}`}>
          <button className="add-staff-btn">
            <span className="plus-icon">+</span> Add New Barber
          </button>
          </Link>
          <Link to={`/EditBarber/${salonId}`}>
          <button className="add-staff-btn">
            <span className="plus-icon">✏️</span> Edit Staff
          </button>
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading staff data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="staff-cards">
            {staffMembers.length === 0 ? (
              <div className="no-data">No staff members found</div>
            ) : (
              staffMembers.map((staff, index) => {
                const initials = getInitials(staff.name);
                return (
                  <div className="staff-card" key={staff.id || index}>
                    <div className="staff-card-header">
                      <div className="staff-initials" style={{ backgroundColor: getInitialsColor(initials) }}>
                        {initials}
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
  

  const renderServicesTab = () => {
    return (
      <div className="services-container">
        <div className="services-header">
          <h2>Services Management</h2>
          <Link to={`/AddService/${salonId}`}>
          <button className="add-service-btn">
            <span className="plus-icon">+</span> Add New Service
          </button>
          </Link>
          <Link to={`/EditService/${salonId}`}>
          <button className="add-service-btn">
            <span className="plus-icon">✏</span> Edit Services
          </button>
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">Loading services data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="services-table">
            <div className="table-header">
              <div className="header-cell service-name-col">SERVICE NAME</div>
              <div className="header-cell service-duration-col">DURATION</div>
              <div className="header-cell service-price-col">PRICE</div>
            </div>

            {services.length === 0 ? (
              <div className="no-data">No services found</div>
            ) : (
              services.map((service) => (
                <div className="table-row" key={service.id}>
                  <div className="cell service-name-col" data-label="SERVICE NAME">
                    {service.name}
                  </div>
                  <div className="cell service-duration-col" data-label="DURATION">
                    {service.duration || '30'} min
                  </div>
                  <div className="cell service-price-col" data-label="PRICE">
                    Rs.{service.price?.toFixed(2) || '0.00'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEarningsTab = () => {
    return (
      <div className="earnings-container">
        <div className="earnings-header">
          <h2>Earnings Dashboard</h2>
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
        
        {loading ? (
          <div className="loading">Loading earnings data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="earnings-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>{`Rs. {timeRange} Revenue`}</h3>
                  <span className="icon revenue-icon">💰</span>
                </div>
                <div className="stat-value">Rs. {getEarningsForTimeRange().toFixed(2)}</div>
                <div className="stat-change positive">
                  <span>↑ 12.5%</span> <span className="change-period">from last period</span>
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

            <div className="chart-container earnings-chart">
              <h3>Revenue Over Time</h3>
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

            <div className="popular-services">
              <h3>Top Services by Revenue</h3>
              <div className="services-breakdown">
                {/* This would be populated based on service revenue data */}
                <div className="service-card">
                  <h4>Haircuts</h4>
                  <div className="service-value">Rs. 1,245.00</div>
                  <div className="service-percentage">42%</div>
                </div>
                <div className="service-card">
                  <h4>Beard Trims</h4>
                  <div className="service-value">Rs. 685.50</div>
                  <div className="service-percentage">23%</div>
                </div>
                <div className="service-card">
                  <h4>Styling</h4>
                  <div className="service-value">Rs. 423.00</div>
                  <div className="service-percentage">14%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverviewTab();
      case 'Appointments':
        return renderAppointmentsTab();
      case 'Staff':
        return renderStaffTab();
      case 'Services':
        return renderServicesTab();
      case 'Earnings':
        return renderEarningsTab();
      case 'Settings':
        return <div className="dashboard-content">Settings content goes here</div>;
      default:
        return <div className="dashboard-content">Welcome to your dashboard!</div>;
    }
  };

  return (
    <div className="salon-dashboard">
      <div className="dashboard-container">
        <nav className="navbar">
          <div className="logo">Salon-It!</div>
          <div className="nav-links">
            <Link to="/ManageAppointments">Manage Appointments</Link>
            <Link to="/SalonFeatures">Features</Link>
            <Link to="/SalonReviews">Reviews</Link>
            <Link to="/SalonFAQ">FAQ</Link>
            <Link to="/SalonContact">Contact</Link>
          </div>
        </nav>

        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <h2 className="dashboard-name">Salon Dashboard</h2>
            <p className="dashboard-description">Manage appointments and salon details</p>
          </div>
          <div className="dashboard-header-right">
            {/* <div className="user-avatar">{validSalonId.toString().substring(0, 1).toUpperCase()}</div> */}
            <div className="user-info">
              <p className="user-name">{salonName}</p>
              <p className="user-type">Verified Salon</p>
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