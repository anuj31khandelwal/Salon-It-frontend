import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Clock3, CheckCircle, AlertCircle, Phone, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import './BarberDashboard.css';

const BarberDashboard = () => {
  const { barberId } = useParams();
  const [dashboard, setDashboard] = useState({
    pendingAppointments: [],
    upcomingAppointments: [],
    pastAppointments: []
  });
  const [barberInfo, setBarberInfo] = useState({
    name: '',
    phone: '',
    email: '',
    role: '',
    initials: ''
  });
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const [activeTimeTab, setActiveTimeTab] = useState('Appointments');
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    // Set current date
    const date = new Date();
    setTodayDate(`${getMonthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`);
    
    // Fetch dashboard data
    if (barberId) {
      fetchDashboardData();
      fetchBarberInfo();
    }
  }, [barberId]);

  const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
  };

  const fetchBarberInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/profile?userId=${barberId}`);
      if (response.ok) {
        const data = await response.json();
        
        // Extract initials from name
        const nameParts = data.name.split(' ');
        const initials = nameParts.length > 1 
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : nameParts[0].substring(0, 2);
        
        setBarberInfo({
          name: data.name,
          phone: data.phoneNumber,
          email: data.email,
          role: data.role,
          initials: initials.toUpperCase()
        });
        
        // Update availability state
        setIsAvailable(data.available);
      }
    } catch (error) {
      console.error('Error fetching barber info:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/barbers/${barberId}/dashboard`);
      if (response.ok) {
        const data = await response.json();
        setDashboard(data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const updateAvailability = async (status) => {
    try {
      const response = await fetch(`/api/barbers/${barberId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });
      
      if (response.ok) {
        setIsAvailable(status);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };
  // Get today's appointments
  const todaysAppointments = dashboard.upcomingAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentTime);
    const today = new Date();
    return appointmentDate.getDate() === today.getDate() && 
           appointmentDate.getMonth() === today.getMonth() && 
           appointmentDate.getFullYear() === today.getFullYear();
  });

  // Find the next appointment
  const nextAppointment = todaysAppointments.length > 0 ? 
    todaysAppointments.reduce((earliest, appointment) => {
      const earliestTime = new Date(earliest.appointmentTime);
      const currentTime = new Date(appointment.appointmentTime);
      return currentTime < earliestTime ? appointment : earliest;
    }, todaysAppointments[0]) : null;

  // Format time (e.g., 10:30 AM)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Calculate week stats
  const weekCompletedCount = dashboard.pastAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentTime);
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    return appointmentDate >= oneWeekAgo;
  }).length;

  // For the weekly change calculation
  // Calculate previous week's appointments
  const previousWeekCompletedCount = dashboard.pastAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointmentTime);
    const today = new Date();
    const oneWeekAgo = new Date();
    const twoWeeksAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    twoWeeksAgo.setDate(today.getDate() - 14);
    return appointmentDate >= twoWeeksAgo && appointmentDate < oneWeekAgo;
  }).length;

  // Get appointments based on active tab
  const getDisplayAppointments = () => {
    const today = new Date();
    
    switch (activeTab) {
      case 'Today':
        return todaysAppointments;
      case 'Upcoming':
        return dashboard.upcomingAppointments.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentTime);
          return appointmentDate.getDate() !== today.getDate() || 
                 appointmentDate.getMonth() !== today.getMonth() || 
                 appointmentDate.getFullYear() !== today.getFullYear();
        });
      case 'Pending':
        return dashboard.pendingAppointments;
      case 'Past':
        return dashboard.pastAppointments;
      default:
        return todaysAppointments;
    }
  };

  // Group appointments by time of day (Morning/Afternoon)
  const groupAppointmentsByTimeOfDay = (appointments) => {
    const morning = appointments.filter(appointment => {
      const appointmentTime = new Date(appointment.appointmentTime);
      const hours = appointmentTime.getHours();
      return hours < 12;
    });

    const afternoon = appointments.filter(appointment => {
      const appointmentTime = new Date(appointment.appointmentTime);
      const hours = appointmentTime.getHours();
      return hours >= 12;
    });

    return { morning, afternoon };
  };

  const { morning, afternoon } = groupAppointmentsByTimeOfDay(getDisplayAppointments());


  return (
    <div className="barber-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Barber Dashboard</h1>
          <p>Manage your appointments and clients</p>
        </div>
        <div className="header-right">
          <div className="barber-profile">
            <div className="profile-initials">{barberInfo.initials || 'BT'}</div>
            <div className="profile-info">
              <h3>{barberInfo.name || 'Barber'}</h3>
              <p>{barberInfo.role || 'Stylist'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="dashboard-nav">
        <div 
          className={`nav-item ${activeTimeTab === 'Appointments' ? 'active' : ''}`}
          onClick={() => setActiveTimeTab('Appointments')}
        >
          Appointments
        </div>
        {/* <div 
          className={`nav-item ${activeTimeTab === 'Schedule' ? 'active' : ''}`}
          onClick={() => setActiveTimeTab('Schedule')}
        >
          Schedule
        </div>
        <div 
          className={`nav-item ${activeTimeTab === 'Profile' ? 'active' : ''}`}
          onClick={() => setActiveTimeTab('Profile')}
        >
          Profile
        </div> */}
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-content">
            <h3>Today's Appointments</h3>
            <div className="card-value">{todaysAppointments.length}</div>
            {nextAppointment && (
              <div className="card-info">
                <Clock size={16} /> Next at {formatTime(nextAppointment.appointmentTime)}
              </div>
            )}
          </div>
          <div className="card-icon">
            <Calendar size={24} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <h3>Pending Approvals</h3>
            <div className="card-value">{dashboard.pendingAppointments.length}</div>
            {dashboard.pendingAppointments.length > 0 && (
              <div className="card-info warning">
                <AlertCircle size={16} /> Needs attention
              </div>
            )}
          </div>
          <div className="card-icon warning">
            <Clock3 size={24} />
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <h3>Completed This Week</h3>
            <div className="card-value">{weekCompletedCount}</div>
            {previousWeekCompletedCount > 0 && (
              <div className="card-info success">
                <CheckCircle size={16} /> {weekCompletedCount > previousWeekCompletedCount ? '+' : ''}
                {weekCompletedCount - previousWeekCompletedCount} from last week
              </div>
            )}
          </div>
          <div className="card-icon success">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* Time Period Tabs */}
      <div className="time-tabs">
        <div 
          className={`time-tab ${activeTab === 'Today' ? 'active' : ''}`}
          onClick={() => setActiveTab('Today')}
        >
          Today
        </div>
        <div 
          className={`time-tab ${activeTab === 'Upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming ({dashboard.upcomingAppointments.length})
        </div>
        <div 
          className={`time-tab ${activeTab === 'Pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('Pending')}
        >
          Pending ({dashboard.pendingAppointments.length})
        </div>
        <div 
          className={`time-tab ${activeTab === 'Past' ? 'active' : ''}`}
          onClick={() => setActiveTab('Past')}
        >
          Past ({dashboard.pastAppointments.length})
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="schedule-section">
        <div className="schedule-header">
          <h2>{activeTab === 'Today' ? 'Today\'s' : activeTab} Schedule</h2>
          <div className="date-navigation">
            <span>{todayDate}</span>
            <div className="nav-buttons">
              <button className="nav-button prev">&lt;</button>
              <button className="nav-button next">&gt;</button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
          {morning.length > 0 && (
            <div className="time-section">
              <div className="time-label">Morning</div>
              
              {/* Morning Appointments */}
              {morning.map(appointment => (
                <div className="appointment-row" key={appointment.id}>
                  <div className="time-slot">
                    <div className="time">{formatTime(appointment.appointmentTime)}</div>
                    <div className="time-indicator"></div>
                  </div>
                  
                  <div className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-title">{appointment.service}</div>
                      <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </div>
                      <div className="more-options">⋮</div>
                    </div>
                    
                    <div className="client-info">
                      <div className="client-initials">
                        {appointment.clientName && appointment.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="client-name">{appointment.clientName}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Current Time Indicator - Only show if viewing Today */}
              {activeTab === 'Today' && new Date().getHours() < 12 && (
                <div className="current-time-indicator">
                  <div className="indicator-dot"></div>
                  <div className="indicator-label">Now</div>
                </div>
              )}
            </div>
          )}
          
          {afternoon.length > 0 && (
            <div className="time-section">
              <div className="time-label">Afternoon</div>
              
              {/* Afternoon Appointments */}
              {afternoon.map(appointment => (
                <div className="appointment-row" key={appointment.id}>
                  <div className="time-slot">
                    <div className="time">{formatTime(appointment.appointmentTime)}</div>
                    <div className="time-indicator"></div>
                  </div>
                  
                  <div className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-title">{appointment.service}</div>
                      <div className={`appointment-status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                      </div>
                      <div className="more-options">⋮</div>
                    </div>
                    
                    <div className="client-info">
                      <div className="client-initials">
                        {appointment.clientName && appointment.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="client-name">{appointment.clientName}</div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Current Time Indicator - Only show if viewing Today */}
              {activeTab === 'Today' && new Date().getHours() >= 12 && (
                <div className="current-time-indicator">
                  <div className="indicator-dot"></div>
                  <div className="indicator-label">Now</div>
                </div>
              )}
            </div>
          )}
          
          {morning.length === 0 && afternoon.length === 0 && (
            <div className="no-appointments">
              <p>No appointments scheduled for {activeTab.toLowerCase()}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;