// File: eco-track/client/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import useNavigate here
import axios from 'axios';  // For making HTTP requests

const Navbar = () => {
  const navigate = useNavigate();  // useNavigate is used to navigate programmatically

  const handleLogout = async () => {
    try {
      // Get the refresh token from localStorage or a cookie
      const refreshToken = localStorage.getItem('refreshToken');  // or sessionStorage or cookie, based on your app's setup

      if (refreshToken) {
        // Send a DELETE request to the backend to log the user out
        await axios.delete('http://localhost:8080/logout', {
          data: { token: refreshToken },
        });

        // Clear the stored tokens
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('accessToken');

        // Redirect to the login page immediately
        navigate('/login');  // Redirect directly to login page
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    // Define the navigation bar using a <nav> element
    <nav>
      <ul>
        {/* Link to the home page */}
        <li><Link to="/home">Home</Link></li>
  
        {/* Link to the waste form page */}
        <li><Link to="/wasteform">Waste Form</Link></li>
  
        {/* Link to the waste breakdown page */}
        <li><Link to="/wastebreakdown">Waste Breakdown</Link></li>
  
        {/* Logout button */}
        <li>
          <button onClick={handleLogout}>Logout</button>  {/* Trigger the handleLogout function when clicked */}
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;
