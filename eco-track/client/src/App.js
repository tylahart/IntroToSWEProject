import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WasteForm from './components/WasteForm';
import Login from './components/Login';
import Register from './components/Register';
import WasteBreakdown from './components/WasteBreakdown';
import Navbar from './components/Navbar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function App() {
    const [progress, setProgress] = useState(0); // Track progress in grams
    const [dailyGoal, setDailyGoal] = useState(1000); // Daily goal for waste data upload
    const [nationalAverage, setNationalAverage] = useState(2200); // National average in grams per day

    const handleGoalChange = (e) => {
        const value = e.target.value;
        setDailyGoal(value === '' ? '' : Number(value)); // Allow empty input
    };

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8080/api/waste/output', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to fetch progress');
            const data = await response.json();
            setProgress(data.wasteOutput); // Update progress
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    useEffect(() => {
        fetchProgress(); // Initial fetch
        const intervalId = setInterval(fetchProgress, 5000); // Fetch every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []); // Run once on component mount

    const blueProgress = Math.min(progress, dailyGoal);
    const redProgress = Math.max(0, progress - dailyGoal);

    // Custom hook to conditionally render Navbar
    const ShowNavbar = () => {
        const location = useLocation();
        const hideNavbarRoutes = ['/', '/login'];

        return !hideNavbarRoutes.includes(location.pathname) && <Navbar />;
    };

    return (
        // Setting up the Router for navigation between different views
        <Router>
          {/* Show the navigation bar on all routes */}
          <ShowNavbar />
      
          {/* Define the routes for the application */}
          <Routes>
            {/* Route for the main or login page */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Route for the registration page */}
            <Route path="/register" element={<Register />} />
            
            {/* Route for the home page, with a welcome message */}
            <Route
              path="/home"
              element={
                <div>
                  <h1>Welcome to EcoTrack</h1>
                  <p>Your personal waste management tracker. Use the navigation bar to explore the app.</p>
                </div>
              }
            />
            
            {/* Route for the waste tracking form page */}
            <Route
              path="/wasteform"
              element={
                <div>
                  {/* Waste form component to upload waste data */}
                  <WasteForm onUploadSuccess={fetchProgress} />
                  
                  {/* Input field to set a daily waste goal */}
                  <div style={{ marginBottom: '20px' }}>
                    <label>
                      Set Daily Goal (grams):
                      <input
                        type="number"
                        value={dailyGoal}
                        onChange={handleGoalChange}
                        min="0"
                      />
                    </label>
                  </div>
                  
                  {/* Circular progress bar displaying current waste tracking progress */}
                  <div
                    style={{
                      position: 'relative',
                      width: 180,
                      height: 180,
                      margin: '20px auto',
                    }}
                  >
                    <CircularProgressbar
                      value={blueProgress}
                      maxValue={dailyGoal || 1}
                      text={`${blueProgress} / ${dailyGoal || 1} g`}
                      strokeWidth={6}
                      styles={buildStyles({
                        textColor: '#ecf0f1',
                        pathColor: '#3e98c7', // Blue color for the progress bar
                        trailColor: '#d6d6d6',
                        textSize: `${Math.min(16, 16 * (180 / 180))}px`, // Dynamically adjust text size
                      })}
                    />
                    
                    {/* Display a second progress bar if redProgress value is greater than 0 */}
                    {redProgress > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <CircularProgressbar
                          value={redProgress}
                          maxValue={progress}
                          text={`+${redProgress} g`} // Displaying the additional waste tracked
                          strokeWidth={6}
                          styles={buildStyles({
                            textColor: '#ecf0f1',
                            pathColor: '#ff0000', // Red color for the additional progress
                            trailColor: '#d6d6d6',
                            textSize: `${Math.min(16, 16 * (180 / 180))}px`, // Dynamically adjust text size
                          })}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Display information about the national average and comparison with the user's progress */}
                  <div style={{ marginTop: '20px' }}>
                    <p>National Average: {nationalAverage} g/day</p>
                    <p>
                      {progress <= nationalAverage
                        ? `You are ${nationalAverage - progress} g below the national average.`
                        : `You are ${progress - nationalAverage} g above the national average.`}
                    </p>
                  </div>
                </div>
              }
            />
            
            {/* Route for the waste breakdown page */}
            <Route path="/wastebreakdown" element={<WasteBreakdown />} />
          </Routes>
        </Router>
      );      
}

export default App;
