// File: eco-track/client/src/App.js

import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'; // Import BrowserRouter
=======
import WasteForm from './components/WasteForm'; // Adjust path if necessary
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
>>>>>>> 62ff57876bbaf5991b0d72232a8317c49ea3ca57
import Navbar from './components/Navbar'; // Adjust path if necessary

function App() {
    return (
<<<<<<< HEAD
            <div className="App">
                <h1>EcoTrack Navigation</h1>
                <Navbar /> 
            </div>
=======
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />  {/* Default route set to Login */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/wasteform" element={<WasteForm />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </div>
        </Router>
>>>>>>> 62ff57876bbaf5991b0d72232a8317c49ea3ca57
    );
}

export default App;