// DetailedWastePage.js

import React from 'react';
import { useParams } from 'react-router-dom';

export const wasteData = {
  organic: {
    title: "Organic Waste",
    description: "Organic waste includes food scraps, yard waste, and other biodegradable materials.",
    impact: "Emits methane gas as it decomposes in landfills, contributing to greenhouse gases.",
    tips: "Compost organic waste to reduce methane emissions and create useful soil."
  },
  recyclable: {
    title: "Recyclable",
    description: "Recyclable waste includes items like bottles, bags, paper, and packaging.",
    impact: "Takes hundreds of years to decompose and is harmful to wildlife.",
    tips: "Reduce plastic usage by using reusable bags, bottles, and containers."
  },
  nonrecyclable: {
    title: "Non-Recyclable",
    description: "Non-recyclable waste includes items like food wrappers, polystyrene foam, and certain coated materials that cannot be processed for recycling.",
    impact: "Ends up in landfills, contributing to pollution and greenhouse gas emissions during decomposition.",
    tips: "Minimize waste by choosing products with minimal or recyclable packaging and opting for reusable alternatives."
  },
  hazardous: {
    title: "Hazardous",
    description: "Plastic waste includes items like bottles, bags, and packaging.",
    impact: "Takes hundreds of years to decompose and is harmful to wildlife.",
    tips: "Reduce plastic usage by using reusable bags, bottles, and containers."
  }
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

export default DetailedWastePage;
