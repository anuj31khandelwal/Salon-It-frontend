import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state and add detailed logging
  const { cart, salonId } = location.state || {};
  
  console.log('Location state received:', location.state);
  console.log('Cart from state:', cart);
  console.log('Salon ID from state:', salonId);

  // Initialize states
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [user, setUser] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);

  // Log initial render
  useEffect(() => {
    console.log('BookingPage component mounted');
  }, []);

  // Explicitly set cartDetails from the cart prop and verify data
  useEffect(() => {
    console.log('Setting cart details from props, cart data:', cart);
    if (cart && Array.isArray(cart) && cart.length > 0) {
      console.log('Cart is valid array with items');
      setCartDetails(cart);
      
      // Debug cart structure
      cart.forEach((item, index) => {
        console.log(`Cart item ${index}:`, item);
        console.log(`Item has name: ${item.name}, price: ${item.price}, duration: ${item.duration}`);
      });
    } else {
      console.warn('Cart is empty, null, or invalid:', cart);
    }
  }, [cart]);

  // Log whenever cartDetails changes
  useEffect(() => {
    console.log('cartDetails state updated:', cartDetails);
  }, [cartDetails]);

  // Calculate total duration
  useEffect(() => {
    if (cartDetails && cartDetails.length > 0) {
      const duration = cartDetails.reduce((sum, service) => {
        console.log(`Adding duration: ${service.duration} from service: ${service.name}`);
        return sum + (service.duration || 0);
      }, 0);
      console.log('Total duration calculated:', duration);
      setTotalDuration(duration);
    }
  }, [cartDetails]);

  // Fetch user details
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userId'));
    console.log('User data fetched:', userData);
    setUser(userData);
  }, [user]);

  // Fetch barbers for the salon
  useEffect(() => {
    if (salonId) {
      console.log('Fetching barbers for salon ID:', salonId);
      fetch(`http://localhost:8080/api/salons/barbers?salonId=${salonId}`)
  .then((res) => res.json())
  .then((data) => {
    console.log('Fetched barbers:', data);
    setBarbers(Array.isArray(data) ? data.map((barber) => ({ id: barber.id, name: barber.name })) : []);
  })
  .catch((error) => console.error('Failed to fetch barbers:', error));
    } else {
      console.error('Salon ID is missing!');
    }
  }, [salonId]);

  // Fetch available slots
  const fetchSlots = () => {
    if (!date || !totalDuration) {
      console.warn('Date or duration missing!');
      return;
    }

    const endpoint = selectedBarber
      ? `http://localhost:8080/api/users/barber/${selectedBarber}/available?salonId=${salonId}&date=${date}&duration=${totalDuration}`
      : `http://localhost:8080/api/users/salon/${salonId}/available?date=${date}&duration=${totalDuration}`;

    console.log('Fetching available slots from:', endpoint);
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log('Available slots:', data);
        setAvailableSlots(data);
      })
      .catch((error) => console.error('Failed to fetch slots:', error));
  };

  // Modified handleBooking to match the API requirements
  const handleBooking = () => {
    console.log('Handling booking...');
    console.log('Current cart details:', cartDetails);
    
    // Make sure we have all required data
    if (!selectedSlot) {
      console.error('No slot selected');
      alert('Please select a time slot');
      return;
    }
    
    if (!user) {
      console.log("User Id:", user);
      console.error('User not logged in or missing ID');
      alert('Please log in to book an appointment');
      return;
    }
    
    if (!cartDetails || !cartDetails.length) {
      console.error('Cart is empty');
      alert('Your cart is empty');
      return;
    }
    
    // Convert slot ID back to array
  const slotIds = JSON.parse(selectedSlot);

  // Prepare the booking request
  const bookingRequest = {
    slotIds: slotIds,  
    customerId: user,
    serviceIds: cartDetails.map((service) => service.id) || [],
  };

  console.log('Booking request payload:', bookingRequest);

  fetch('http://localhost:8080/api/users/book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingRequest),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errorMessage) {
        alert(`Booking failed: ${data.errorMessage}`);
      } else {
        console.log('Booking successful:', data);
        alert('Booking successful!');
        navigate('/ConfirmationPage',{ state: { booking: data } });
      }
    })
    .catch((error) => {
      alert('An error occurred while booking. Please try again.');
    });
  };

  // Add beforeunload event to prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const message = "You have items in your cart. Are you sure you want to leave?";
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <div className="booking-page-wrapper">
      <h2>Book Your Appointment</h2>
      <div className="booking-details">
        <h3>Cart Details:</h3>
        <ul>
          {/* Debug cart rendering */}
          <li className="debug-info">Cart has {cartDetails ? cartDetails.length : 0} items</li>
          
          {cartDetails && cartDetails.length > 0 ? (
            cartDetails.map((item, index) => (
              <li key={item.cartId || item.id || index}>
                {item.name || 'Unnamed service'} — ₹{item.price || 0} 
                {item.duration ? `(${item.duration} mins)` : ''}
              </li>
            ))
          ) : (
            <li>No items in cart</li>
          )}
        </ul>

        <h3>Select Barber (Optional):</h3>
        <select onChange={(e) => setSelectedBarber(e.target.value)} value={selectedBarber}>
          <option value="">Any Barber</option>
          {barbers.map((barber) => (
            <option key={barber.id} value={barber.id}>
              {barber.name}
            </option>
          ))}
        </select>

        <h3>Select Date:</h3>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={fetchSlots}>Get Available Slots</button>

        {availableSlots.length > 0 && (
          <>
            <h3>Select Slot:</h3>
            <select onChange={(e) => setSelectedSlot(e.target.value)} value={selectedSlot}>
  <option value="">Select a slot</option>
  {availableSlots.map((slot, index) => (
    <option key={index} value={JSON.stringify(slot.slotId)}>
      {slot.startTime} - {slot.endTime} (Barber: {slot.barberName})
    </option>
  ))}
</select>
          </>
        )}

        <button
          onClick={handleBooking}
          disabled={!selectedSlot || !cartDetails.length}
          className="book-appointment-btn"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default BookingPage;