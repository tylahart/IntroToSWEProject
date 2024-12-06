// DetailedWastePage.js

import React from 'react';
import { useParams } from 'react-router-dom';

// Object containing detailed information about various waste types
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
  // Retrieve the waste type from the URL parameters using React Router
  const { wasteType } = useParams();

  // Fetch corresponding waste information from the wasteData object
  const wasteInfo = wasteData[wasteType];

  // Handle cases where the waste type does not exist in the dataset
  if (!wasteInfo) {
    return <h2>Waste type not found.</h2>;
  }

  // Render the detailed page with waste information
  return (
    <div>
      <h1>{wasteInfo.title}</h1> {/* Display the title of the waste type */}
      <p>{wasteInfo.description}</p> {/* Display the description */}
      
      <h2>Environmental Impact</h2>
      <p>{wasteInfo.impact}</p> {/* Display the environmental impact */}
      
      <h2>Reduction Tips</h2>
      <p>{wasteInfo.tips}</p> {/* Display tips for waste reduction */}
    </div>
  );
};


export default DetailedWastePage;
