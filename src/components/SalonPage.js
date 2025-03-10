import React, { useState, useEffect } from 'react';
import './SalonPage.css';
import { useParams,useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaClock, FaSearch } from 'react-icons/fa';

const SalonPage = () => {
  const { salonId } = useParams();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All Services');

  // Fetch salon details and services
  useEffect(() => {
    const fetchSalonData = async () => {
      try {
        const salonResponse = await fetch(`http://localhost:8080/api/salons/${salonId}`);
        if (!salonResponse.ok) throw new Error('Failed to fetch salon details');
        const salonData = await salonResponse.json();
        setSalon(salonData);

        const servicesResponse = await fetch(`http://localhost:8080/api/salons/${salonId}/services`);
        if (!servicesResponse.ok) throw new Error('Failed to fetch services');
        const servicesData = await servicesResponse.json();
        
        // Check if the response is actually an array
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          console.warn('Services data is not an array:', servicesData);
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching salon or services data:', error);
      }
    };

    fetchSalonData();
  }, [salonId]);

  // Show cart when items are added
  useEffect(() => {
    setShowCart(cart.length > 0);
  }, [cart]);

  // Get unique categories
  const categories = ['All Services', ...new Set(services.map(service => service.category))];

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All Services' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Add service to cart
  const addToCart = (service) => {
    setCart([...cart, { ...service, cartId: Date.now() }]);
  };

  // Remove service from cart
  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
    if (cart.length === 1) {
      setShowCart(false);
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  // Toggle cart visibility
  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const navigate = useNavigate();

const handleBookAppointment = () => {
  navigate('/BookingPage', { state: { cart, salonId } });
};


  if (!salon) return <div>Loading salon details...</div>;

  return (
    <div className="salon-page">
      <div className="salon-header">
        <div className="salon-image-container">
          <img
            src={salon.imageUrl || 'https://media.istockphoto.com/id/1497806504/photo/hair-styling-in-beauty-salon-woman-does-her-hair-in-modern-beauty-salon-woman-stylist-dries.jpg?s=612x612&w=0&k=20&c=3dO_HWS8WvSGNbGmxTsqK70vZMGqM2REnbVJG09YnmI='}
            alt={salon.name}
            className="salon-image"
          />
        </div>
        <div className="salon-info">
          <h1>{salon.name}</h1>
          <div className="contact-info">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <p>{salon.address}</p>
              </div>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <p>{salon.phoneNumber}</p>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <p>{salon.openingTime} AM</p>
                <p>{salon.closingTime} PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search for salon services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="main-content">
        <div className="services-container">
          {filteredServices.length === 0 ? (
            <p className="no-results">No services found. Try a different search term.</p>
          ) : (
            <div className="service-list">
              {filteredServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-details">
                    <h4>{service.name}</h4>
                    <p className="service-price">Rs.{service.price}</p>
                  </div>
                  <button 
                    className="add-button"
                    onClick={() => addToCart(service)}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && showCart && (
          <div className="cart-container">
            <div className="cart-header">
              <h2>Your Selections</h2>
              <button className="close-cart" onClick={toggleCart}>×</button>
            </div>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.cartId} className="cart-item">
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p>Rs.{item.price}</p>
                  </div>
                  <button 
                    className="remove-button" 
                    onClick={() => removeFromCart(item.cartId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <h3>Total: Rs.{totalPrice}</h3>
            </div>
            <button className="book-button" onClick={handleBookAppointment}>
              Book Appointment
            </button>
          </div>
        )}
        
        {cart.length > 0 && !showCart && (
          <button className="cart-toggle" onClick={toggleCart}>
            View Cart ({cart.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default SalonPage;
