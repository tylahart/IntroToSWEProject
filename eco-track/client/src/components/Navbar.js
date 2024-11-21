// File: eco-track/client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';  // Import only Link, not Router

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/wasteform">Waste Form</Link></li>
      <li><Link to="/wastebreakdown">Waste Breakdown</Link></li>
    </ul>
  </nav>
);

export default Navbar;
