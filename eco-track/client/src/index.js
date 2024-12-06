import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ProgressProvider } from './ProgressContext'; // Import the ProgressProvider

// Create a root element for rendering the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application wrapped in a React.StrictMode component
root.render(
  <React.StrictMode>
    {/* Wrap the App component with ProgressProvider to provide global state */}
    <ProgressProvider> 
      <App /> {/* Render the main App component */}
    </ProgressProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
