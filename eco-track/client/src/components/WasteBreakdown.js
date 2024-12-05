import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const WasteBreakdown = () => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWasteData = async () => {
      try {
        // Fetch data from the backend (adjust the endpoint if necessary)
        const token = localStorage.getItem('accessToken'); // Use the user's token for authentication
        const response = await axios.get('http://localhost:8080/api/waste/breakdown', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform the fetched data into the required format for the chart
        const transformedData = response.data.map((type) => ({
          name: type.type, // Type of waste
          value: type.totalWeight, // Aggregate weight for this type
        }));

        setWasteData(transformedData);
      } catch (error) {
        console.error('Error loading waste data:', error);
      } finally {
        setLoading(false);
      }
    };

    getWasteData();
  }, []);

  // Show loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if there is no data to display
  if (!wasteData || wasteData.length === 0) {
    return <div>No waste data available to display.</div>;
  }

  return (
    <div>
      <h1>Waste Breakdown</h1>

      {/* Pie Chart */}
      <PieChart width={400} height={400}>
        <Pie
          data={wasteData}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={(entry) => `${entry.name}: ${entry.value} grams`}
        >
          {wasteData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* Waste Cards with Numerical Amounts */}
      <div className="waste-cards">
        {wasteData.map((waste, index) => (
          <div key={index} className="waste-card">
            <h2>{waste.name}</h2>
            <p>{`Disposed: ${waste.value} kg`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteBreakdown;
