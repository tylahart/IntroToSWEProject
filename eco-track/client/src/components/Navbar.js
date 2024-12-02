// File: eco-track/client/src/components/Navbar.js
import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import BrowserRouter
import WasteForm from './WasteForm'; 
import WasteBreakdown from './WasteBreakdown'; 
import Home from './Home'; 

const Navbar = () => (
    <Router>
        <div>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/waste-form">Waste Form</Link></li>
                    <li><Link to="/waste-breakdown">Waste Breakdown</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/waste-form" element={<WasteForm />} />
                <Route path="/waste-breakdown" element={<WasteBreakdown />} />
            </Routes>
        </div>
    </Router>
);

export default Navbar;

{/* <Router>
<div>
    <nav>
        <Link to="/login">Login</Link> | <Link to="/login">Login</Link>
    </nav>

    <Routes>
        <Route path="/login" element={<Login/>}/>
    </Routes>
</div>
</Router> */}
=======
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
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/wasteform">Waste Form</Link></li>
        <li><Link to="/wastebreakdown">Waste Breakdown</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>  {/* Use button for logout in navbar */}
      </ul>
    </nav>
  );
};

export default Navbar;
>>>>>>> 62ff57876bbaf5991b0d72232a8317c49ea3ca57
