import React, { useState } from 'react';
import api from '../api';
import './SalonRegistration.css';

const SalonRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    openingTime: '09:00:00',
    closingTime: '21:00:00',
    ownerId: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
      // Prepare the data in the format exactly matching your API requirements
      const salonData = {
        owner: {
          id: parseInt(formData.ownerId)
        },
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        openingTime: formData.openingTime,
        closingTime: formData.closingTime
      };
  
      console.log('Sending salon data:', salonData);
  
      // Send the data to your API - using the endpoint from your Spring controller
      const response = await api.post('/api/salons/register', salonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('API response:', response);
  
      if (response.status !== 200) {
        throw new Error(response.data || 'Failed to register salon');
      }
  
      setSuccess('Salon registered successfully!');
  
      // Reset the form
      setFormData({
        name: '',
        address: '',
        phoneNumber: '',
        openingTime: '09:00:00',
        closingTime: '21:00:00',
        ownerId: ''
      });
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
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="salon-form">
        <div className="form-group">
          <label htmlFor="name">
            Salon Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">
            Address*
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phoneNumber">
            Phone Number*
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            placeholder="XXX-XXX-XXXX"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="openingTime">
              Opening Time*
            </label>
            <input
              type="time"
              id="openingTime"
              name="openingTime"
              value={formData.openingTime.substring(0, 5)}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="closingTime">
              Closing Time*
            </label>
            <input
              type="time"
              id="closingTime"
              name="closingTime"
              value={formData.closingTime.substring(0, 5)}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="ownerId">
            Owner ID*
          </label>
          <input
            type="number"
            id="ownerId"
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        
        <div className="form-button">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Salon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalonRegistrationForm;