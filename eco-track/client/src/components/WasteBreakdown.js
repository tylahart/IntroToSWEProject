import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { wasteData as detailedWasteData } from './DetailedWastePage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const normalizeName = (name) => name.toLowerCase().replace(/[-\s]/g, '');

const WasteBreakdown = () => {
  const [wasteData, setWasteData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWasteData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8080/api/waste/breakdown', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformedData = response.data.map((type) => ({
          name: normalizeName(type.type), // Normalize names for matching
          value: type.totalWeight,
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

  if (loading) return <div>Loading...</div>;

  if (!wasteData || wasteData.length === 0) {
    return <div>No waste data available to display.</div>;
  }

  return (
    <div>
      <h1>Waste Breakdown</h1>

      <PieChart width={900} height={400}>
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

      <div className="waste-cards">
        {wasteData.map((waste, index) => {
          const wasteInfo = detailedWasteData[waste.name] || {
            description: 'No description available.',
            impact: 'No impact data available.',
            tips: 'No tips available.',
          };

          return (
            <div key={index} className="waste-card">
              <h2>{detailedWasteData[waste.name]?.title || waste.name}</h2>
              <p>{`Disposed: ${waste.value} grams`}</p>
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
