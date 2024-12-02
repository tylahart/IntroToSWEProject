// DetailedWastePage.js

import React from 'react';
import { useParams } from 'react-router-dom';

const wasteData = {
  plastic: {
    title: "Plastic Waste",
    description: "Plastic waste includes items like bottles, bags, and packaging.",
    impact: "Takes hundreds of years to decompose and is harmful to wildlife.",
    tips: "Reduce plastic usage by using reusable bags, bottles, and containers."
  },
  organic: {
    title: "Organic Waste",
    description: "Organic waste includes food scraps, yard waste, and other biodegradable materials.",
    impact: "Emits methane gas as it decomposes in landfills, contributing to greenhouse gases.",
    tips: "Compost organic waste to reduce methane emissions and create useful soil."
  },
  // will add more waste types as needed
};

const DetailedWastePage = () => {
  const { wasteType } = useParams(); // Access waste type from URL parameter
  const wasteInfo = wasteData[wasteType];

  if (!wasteInfo) {
    return <h2>Waste type not found.</h2>;
  }

  return (
    <div>
      <h1>{wasteInfo.title}</h1>
      <p>{wasteInfo.description}</p>
      <h2>Environmental Impact</h2>
      <p>{wasteInfo.impact}</p>
      <h2>Reduction Tips</h2>
      <p>{wasteInfo.tips}</p>
    </div>
  );
};

<<<<<<< HEAD
export default DetailedWastePage;
=======
export default DetailedWastePage;
>>>>>>> 62ff57876bbaf5991b0d72232a8317c49ea3ca57
