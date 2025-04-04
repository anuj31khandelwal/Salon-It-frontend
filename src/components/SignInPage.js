import React, { useState } from 'react';
import './SignInPage.css';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
  
    try {
      const loginData = {
        username: username,
        password: password
      };
  
      console.log("Sending login request with data:", loginData);
      
      const response = await api.post('/api/auth/login', loginData);
  
      console.log("Login response:", response);
  
      if (response.data && response.data.customerId) {
        console.log("Customer ID received:", response.data.customerId);
      } else {
        console.warn("Customer ID not found in response!");
      }
  
      // Extract customerType from response
      const customerType = response.data.customerType; // OWNER, USER, or BARBER
      console.log("Customer Type:", customerType);
  
      localStorage.setItem('username', response.data.customerName || '');
      localStorage.setItem('userId', response.data.customerId || '');
      localStorage.setItem('customerType', customerType || '');
  
      // Redirect based on customerType
      if (customerType === "OWNER") {
        navigate('/SalonOwnerPage');
      } else if (customerType === "USER") {
        navigate('/SelectLocation');
      } else if (customerType === "BARBER") {
        navigate(`/BarberDashboard/${response.data.customerId}`);
      } else {
        setError("Invalid customer type received.");
      }
  
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response) {
        console.log("Error response from server:", error.response.data);
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        console.warn("No response received from server");
        setError('No response from server. Please try again later.');
      } else {
        console.error("Request setup error:", error.message);
        setError('Error: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };  
  

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1>Sign in to your account</h1>
        <p className="create-account-text">
          Or <a href="/SignUpPage">create a new account</a>
        </p>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Email or Phone Number"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={handleRememberMe}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <a href="/forgot-password" className="forgot-password">
              Forgot your password?
            </a>
          </div>

          <button 
            type="submit" 
            className="signin-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <FaLock className="lock-icon" />
                Sign in
              </>
            )}
          </button>
        </form>
        </div>
    </div>
  );
};

export default SignInPage;
