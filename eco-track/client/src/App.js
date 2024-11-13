// File: eco-track/client/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'; // Import BrowserRouter
import Navbar from './components/Navbar'; // Adjust path if necessary

function App() {
    return (
            <div className="App">
                <h1>EcoTrack Navigation</h1>
                <Navbar /> 
            </div>
    );
}

export default App;
