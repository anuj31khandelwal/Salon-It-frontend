import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './SalonRegistration.css';

const SalonRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    openingTime: '09:00:00',
    closingTime: '21:00:00',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ownerId, setOwnerId] = useState(null);

  const navigate = useNavigate();

  // Fetch owner ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setOwnerId(parseInt(storedUserId, 10));
    } else {
      setError('Owner ID not found. Please log in again.');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
        if (!ownerId) {
            throw new Error('Owner ID is missing. Please log in again.');
        }

        const salonData = {
            owner: { id: ownerId },
            ...formData
        };

        console.log('Sending salon data:', salonData);

        const response = await api.post('/api/salons/register', salonData, {
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('API response:', response);

        if (response.status !== 200 || !response.data.salonId) {
            throw new Error(response.data.message || 'Failed to register salon');
        }

        setSuccess('Salon registered successfully!');
        const salonId = response.data.salonId;

        // Redirect to UploadDocuments/{salonId}
        navigate(`/UploadDocuments/${salonId}`);

    } catch (error) {
        console.error('Error registering salon:', error);
        setError(error.message || 'Failed to register salon. Please try again later.');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="salon-registration-container">
      <h1 className="salon-title">Register Your Salon</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="salon-form">
        <div className="form-group">
          <label htmlFor="name">Salon Name*</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address*</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number*</label>
          <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="XXX-XXX-XXXX" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="openingTime">Opening Time*</label>
            <input type="time" id="openingTime" name="openingTime" value={formData.openingTime.substring(0, 5)} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="closingTime">Closing Time*</label>
            <input type="time" id="closingTime" name="closingTime" value={formData.closingTime.substring(0, 5)} onChange={handleChange} required />
          </div>
        </div>

        {/* <div className="form-group">
          <label>Owner ID*</label>
          <input type="number" value={ownerId || ''} disabled />
        </div> */}

        <div className="form-button">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register Salon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalonRegistrationForm;
