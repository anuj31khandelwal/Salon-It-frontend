import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitySelection.css';
import { Search } from 'lucide-react';

const CitySelection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const popularCities = [
    { name: 'Mumbai', icon: '🏛️' },
    { name: 'Delhi-NCR', icon: '🏛️' },
    { name: 'Bengaluru', icon: '🏛️' },
    { name: 'Hyderabad', icon: '🏛️' },
    { name: 'Ahmedabad', icon: '🏛️' },
    { name: 'Chandigarh', icon: '🏛️' },
    { name: 'Pune', icon: '🏛️' },
    { name: 'Chennai', icon: '🏛️' },
    { name: 'Kolkata', icon: '🏛️' },
    { name: 'Kochi', icon: '🏛️' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/SalonResults?city=${searchQuery.trim()}`);
    }
  };

  const handleCityClick = (cityName) => {
    navigate(`/SalonResults?city=${cityName}`);
  };

  return (
    <div className="city-selection-container">
      <form className="search-bar-container" onSubmit={handleSearchSubmit}>
        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for your city"
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </form>

      <div className="popular-cities-section">
        <h2 className="section-title">Popular Cities</h2>
        <div className="cities-grid">
          {popularCities.map((city, index) => (
            <div
              key={index}
              className="city-item"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="city-icon">{city.icon}</div>
              <span className="city-name">{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitySelection;
