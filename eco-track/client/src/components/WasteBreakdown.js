import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { wasteData as detailedWasteData } from './DetailedWastePage';

// Define the color scheme for the pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Helper function to normalize waste type names by removing spaces and converting to lowercase
const normalizeName = (name) => name.toLowerCase().replace(/[-\s]/g, '');

// Main component for displaying the waste breakdown
const WasteBreakdown = () => {
  // State to store the waste data and loading state
  const [wasteData, setWasteData] = useState([]); // Stores the waste breakdown data
  const [loading, setLoading] = useState(true); // Tracks if data is still being fetched

  // useEffect hook to fetch waste data when the component is mounted
  useEffect(() => {
    const getWasteData = async () => {
      try {
        // Retrieve the access token from local storage
        const token = localStorage.getItem('accessToken');
        
        // Make a GET request to fetch waste data from the server
        const response = await axios.get('http://localhost:8080/api/waste/breakdown', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authorization
          },
        });

        // Transform the response data into the format needed for the pie chart
        const transformedData = response.data.map((type) => ({
          name: normalizeName(type.type), // Normalize the waste type name
          value: type.totalWeight, // Set the total weight for each waste type
        }));

        // Update the state with the transformed data
        setWasteData(transformedData);
      } catch (error) {
        console.error('Error loading waste data:', error); // Log any errors that occur
      } finally {
        setLoading(false); // Set loading to false once data fetching is complete
      }
    };

    getWasteData(); // Call the async function to fetch the data
  }, []); // Empty dependency array means this runs only once when the component is mounted

  // Show loading state while data is being fetched
  if (loading) return <div>Loading...</div>;

  // Show a message if no waste data is available
  if (!wasteData || wasteData.length === 0) {
    return <div>No waste data available to display.</div>;
  }

  return (
    <div>
      {/* Title of the page */}
      <h1>Waste Breakdown</h1>

      {/* Pie chart displaying the waste data */}
      <PieChart width={900} height={400}>
        <Pie
          data={wasteData} // The pie chart data
          cx="50%" // Center X of the pie chart
          cy="50%" // Center Y of the pie chart
          outerRadius={150} // Outer radius of the pie chart
          fill="#8884d8" // Default fill color for the pie chart segments
          dataKey="value" // The key to access the value for each pie segment
          label={(entry) => `${entry.name}: ${entry.value} grams`} // Label for each pie segment
        >
          {/* Map through the waste data to assign colors to each pie segment */}
          {wasteData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip /> {/* Display tooltip on hover */}
        <Legend /> {/* Display a legend for the pie chart */}
      </PieChart>

      {/* Render waste breakdown details as cards */}
      <div className="waste-cards">
        {wasteData.map((waste, index) => {
          // Get detailed information for each waste type (fallback if no data)
          const wasteInfo = detailedWasteData[waste.name] || {
            description: 'No description available.',
            impact: 'No impact data available.',
            tips: 'No tips available.',
          };

          return (
            <div key={index} className="waste-card">
              {/* Display title and waste amount for each waste type */}
              <h2>{detailedWasteData[waste.name]?.title || waste.name}</h2>
              <p>{`Disposed: ${waste.value} grams`}</p>
              {/* Display description, impact, and tips */}
              <p>Description: {wasteInfo.description}</p>
              <p>Impact: {wasteInfo.impact}</p>
              <p>Tips: {wasteInfo.tips}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WasteBreakdown;
