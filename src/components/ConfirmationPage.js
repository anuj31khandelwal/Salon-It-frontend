import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  // Format date and time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-card">
        <h1>Appointment Confirmed!</h1>
        {booking && booking.appointments.length > 0 ? (
          <>
            <p>Thank you for booking your appointment at <strong>"{booking.appointments[0].salonName}"</strong>!</p>
            <p>Barber: <strong>"{booking.appointments[0].barberName}"</strong></p>
            
            <h2>Appointment Details</h2>
            <ul className="appointment-list">
  {booking?.appointments?.map((appointment) => (
    <li key={appointment.appointmentId} className="appointment-item">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px',alignItems: 'justify' }}>
        <div><strong>Service Name:</strong> {appointment.serviceName}</div>
        <div><strong>Booking ID:</strong> {appointment.appointmentId}</div>
        <div>{formatDateTime(appointment.startTime)} - {formatDateTime(appointment.endTime)}</div>
      </div>
    </li>
  ))}
</ul>
            <h2>Total Bill: ₹{booking.totalBill}</h2>
          </>
        ) : (
          <p>No appointment details available.</p>
        )}

        <div className="button-group">
          <button className="home-btn" onClick={() => navigate('/')}>Return to Home</button>
          <button className="book-another-btn" onClick={() => navigate('/SelectLocation')}>Book Another Appointment</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
