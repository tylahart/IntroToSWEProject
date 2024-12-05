import React, { createContext, useContext, useState } from 'react';

// Create the ProgressContext
const ProgressContext = createContext();

// Custom hook to use ProgressContext
export const useProgress = () => useContext(ProgressContext);

// ProgressProvider component to wrap the app
export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(0);

    // Function to reset progress (used for initial fetch)
    const setInitialProgress = (amount) => {
        setProgress(amount);
    };

    // Function to increment progress on new uploads
    const updateProgress = (amount) => {
        setProgress((prev) => prev + amount);
    };

    return (
        <ProgressContext.Provider value={{ progress, updateProgress, setInitialProgress }}>
            {children}
        </ProgressContext.Provider>
    );
};
