import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SalonOwnerPage.css';
import api from '../api';

const SalonOwnerPage = () => {
  const [salons, setSalons] = useState([]);
  const [showSalons, setShowSalons] = useState(false);
  const navigate = useNavigate();

  const ownerId = localStorage.getItem('userId');

  const fetchSalons = async () => {
    try {
      const response = await api.get(`/api/salons/allSalons/${ownerId}`);
      setSalons(response.data);
      console.log('Salons:', response.data);
      setShowSalons(true);
    } catch (error) {
      console.error('Error fetching salons:', error);
    }
  };

  return (
    <div className="salon-owner-container">
      <h1>Salon Owner Dashboard</h1>
      
      {/* Buttons for Adding Salon & Viewing Existing Salons */}
      <div className="button-container">
        <button className="add-salon-btn" onClick={() => navigate('/SalonRegistration')}>
          Add Salon
        </button>
        <button className="view-salons-btn" onClick={fetchSalons}>
          Your Existing Salons
        </button>
      </div>

      {/* Salon List Section */}
      {showSalons && (
        <div className="salon-list">
          <h2>Your Salons</h2>
          {salons.length === 0 ? (
            <p>No salons found.</p>
          ) : (
            <ul>
              {salons.map((salon) => (
                <li key={salon.id} className="salon-item">
                  <span>{salon.name}</span>
                  <button 
                    className="manage-btn"
                    onClick={() => navigate(`/SalonDashboard/${salon.id}`)}
                  >
                    Manage
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SalonOwnerPage;
