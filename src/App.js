import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import SalonDashboard from './components/SalonDashboard';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import SelectLocation from './components/CitySelection';
import SalonResults from './components/SalonResults';
import SalonPage from './components/SalonPage';
import BookingPage from './components/BookingPage';
import SalonRegistrationForm from './components/SalonRegistration';
import ConfirmationPage from './components/ConfirmationPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/UserDashboard/:userId" element={<UserDashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/SalonDashboard" element={<SalonDashboard />} />
          <Route path="/SignInPage" element={<SignInPage />} />  
          <Route path="/SignUpPage" element={<SignUpPage />} /> 
          <Route path ="/Features" element={<Features />} />
          <Route path = "/HowItWorks" element={<HowItWorks />} />
          <Route path = "/SelectLocation" element={<SelectLocation />} />
          <Route path = "/SalonResults" element={<SalonResults />} /> 
          <Route path = "/SalonPage/:salonId" element={<SalonPage />} />
          <Route path="/BookingPage" element={<BookingPage />} /> 
          <Route path="/SalonRegistration" element={<SalonRegistrationForm />} /> 
          <Route path="/ConfirmationPage" element={<ConfirmationPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
