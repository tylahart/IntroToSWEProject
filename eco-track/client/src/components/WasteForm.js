import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadWasteData } from '../api/wasteService';

// The WasteForm component handles waste data submission
const WasteForm = ({ onUploadSuccess }) => {
    // States for waste type, amount, and available waste options
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');
    const [wasteOptions, setWasteOptions] = useState([]);

    // useEffect hook to fetch the list of waste types from the backend API
    useEffect(() => {
        const fetchWasteOptions = async () => {
            try {
                // Fetching available waste items from the backend
                console.log('Fetching waste options...');
                const response = await axios.get('http://localhost:8080/api/items'); 
                console.log('Fetched data:', response.data);

                // Mapping the fetched data into a suitable format for the dropdown
                const items = response.data.map((entry) => ({
                    label: entry.item, // Item name for dropdown
                    type: entry.type, // Item type
                    weight: Number(entry.weight), // Weight of the waste item
                }));

                // Updating the state with the available waste options
                console.log('Mapped items:', items);
                setWasteOptions(items);
            } catch (error) {
                // Handling error if the fetch fails
                console.error('Error fetching waste options:', error.message);
                alert('Failed to load waste options');
            }
        };

        // Fetch the waste options when the component mounts
        fetchWasteOptions();
    }, []);  // Empty dependency array means this runs only once after the first render

    // handleSubmit function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevents page refresh on form submission
    
        try {
            // Retrieve the authentication token from localStorage
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('You must be logged in to upload waste data.');
                return;
            }
    
            // Find the selected waste option from the list of available options
            const option = wasteOptions.find((option) => option.label === wasteType);
            if (!option) {
                alert('Invalid waste type selected.');
                return;
            }
    
            // Parse the amount entered by the user and validate it
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                alert('Please enter a valid amount.');
                return;
            }
    
            // Log the selected option for debugging purposes
            console.log('Selected Option:', option);
    
            // Upload the waste data to the backend using the uploadWasteData API function
            await uploadWasteData({
                wasteType: option.label,
                amount: numericAmount,
                weight: option.weight, // Include weight for the item
                type: option.type, // Include type for categorization
            });
    
            // Notify the user that the data has been successfully uploaded
            alert('Waste data uploaded successfully!');
            // Reset form fields after successful submission
            setWasteType('');
            setAmount('');
        } catch (error) {
            // Handle errors during the upload process
            console.error('Error during waste data upload:', error.response?.data || error.message);
            alert(`Failed to upload data: ${error.response?.data?.message || error.message}`);
        }
    };    

    return (
        // Render the form to capture waste type and amount
        <form onSubmit={handleSubmit}>
            <label htmlFor="wasteType">Select Waste Type:</label>
            <select
                id="wasteType"
                value={wasteType}
                onChange={(e) => {
                    setWasteType(e.target.value); // Update state when a new waste type is selected
                }}
                required
            >
                <option value="" disabled>
                    Select Waste Type
                </option>
                {/* Map through available waste options and render them as dropdown items */}
                {wasteOptions.map((option, index) => (
                    <option key={index} value={option.label}>
                        {option.label} {/* Display item name as the option */}
                    </option>
                ))}
            </select>

            <label htmlFor="amount">Amount:</label>
            <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} // Update the amount as user types
                placeholder="Amount"
                required
            />

            {/* Submit button to upload the waste data */}
            <button type="submit">Upload</button>
        </form>
    );
};

export default WasteForm;
