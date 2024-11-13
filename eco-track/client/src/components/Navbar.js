// File: eco-track/client/src/components/Navbar.js
import React from 'react';
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
