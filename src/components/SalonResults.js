import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './SalonResults.css';

const SalonResults = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const city = params.get('city');

  const userId = localStorage.getItem('userId');
  const userName  = localStorage.getItem('username');
  console.log('salonPage userId:', userId);

  // Fetch salons when city changes
  useEffect(() => {
    if (city) {
      fetch(`http://localhost:8080/api/salons/searchByLocation?location=${city}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch salons: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setSalons(data);
        })
        .catch((error) => {
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('City not provided in search parameters.');
    }
  }, [city]);

  // Handle navigation to the salon page
  const handleSalonClick = (salonId) => {
    navigate(`/SalonPage/${salonId}`);
  };

  // Handle profile navigation
  useEffect(() => {
    if (!userId) {
      console.warn('No userId found, redirecting to login...');
    }
  }, [userId]);

  const handleProfileClick = () => {
    if (userId && userName) {
      navigate(`/UserDashboard/${userId}`, { state: { userName } });
    } else {
      alert('Please log in to view your profile.');
      navigate('/Login');
    }
  };

  if (loading) return <div className="loading-message">Loading salons...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="salon-results-wrapper">
      <nav className="navbar">
        <div className="logo">Salon-It!</div>
        <div className="nav-links">
          <Link to="/Features">Features</Link>
          <Link to="/HowItWorks">How It Works</Link>
          <Link to="/SalonRegistration">Partner with Us</Link>
          <Link to="/FAQ">FAQ</Link>
          <Link to="/Contact">Contact</Link>
          <button 
            className="login-btn" 
            onClick={handleProfileClick}
          >
            {userId ? 'Profile' : 'Login'}
          </button>
        </div>
      </nav>

      <h2 className="salon-results-title">Salons in {city}</h2>
      <div className="salon-card-container">
        {salons.length > 0 ? (
          salons.map((salon) => (
            <div 
              key={salon.id} 
              className="salon-card"
              onClick={() => handleSalonClick(salon.id)} 
              style={{ cursor: 'pointer' }}
            >
              <img
                src={salon.imageUrl || 'https://media.istockphoto.com/id/1497806504/photo/hair-styling-in-beauty-salon-woman-does-her-hair-in-modern-beauty-salon-woman-stylist-dries.jpg?s=612x612&w=0&k=20&c=3dO_HWS8WvSGNbGmxTsqK70vZMGqM2REnbVJG09YnmI='}
                alt={salon.name}
                className="salon-card-image"
              />
              <div className="salon-card-content">
                <h3 className="salon-card-title">{salon.name}</h3>
                <p className="salon-card-address">{salon.address}</p>
                <p className="salon-card-timing">Opening Time: {salon.openingTime}</p>
                <p className="salon-card-timing">Closing Time: {salon.closingTime}</p>
                <p className="salon-card-phone">Phone: {salon.phoneNumber}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-salon-message">No salons found in {city}</p>
        )}
      </div>
    </div>
  );
};

export default SalonResults;
