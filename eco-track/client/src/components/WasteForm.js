import React, { useState, useEffect } from 'react';
import { uploadWasteData } from '../api/wasteService';
import axios from 'axios';

const WasteForm = () => {
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');
    const [wasteOptions, setWasteOptions] = useState([]);

    useEffect(() => {
        const fetchWasteOptions = async () => {
            try {
                console.log('Fetching waste options...');
                const response = await axios.get('http://localhost:8080/api/items'); // Ensure the URL matches your backend
                console.log('Fetched data:', response.data);

                const items = response.data.map((entry) => ({
                    label: entry.item, // Item name for dropdown
                    type: entry.type, // Store type for later use
                    weight: Number(entry.weight), // Store weight for later use
                }));

                console.log('Mapped items:', items);
                setWasteOptions(items);
            } catch (error) {
                console.error('Error fetching waste options:', error.message);
                alert('Failed to load waste options');
            }
        };

        fetchWasteOptions();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('You must be logged in to upload waste data.');
                return;
            }
    
            const option = wasteOptions.find((option) => option.label === wasteType);
            if (!option) {
                alert('Invalid waste type selected.');
                return;
            }
    
            console.log('Selected Option:', option);
    
            await uploadWasteData({
                wasteType: option.label,
                amount,
                weight: option.weight, // Include weight
                type: option.type, // Include type
            });
    
            alert('Waste data uploaded successfully!');
            setWasteType('');
            setAmount('');
        } catch (error) {
            console.error('Error during waste data upload:', error.response?.data || error.message);
            alert(`Failed to upload data: ${error.response?.data?.message || error.message}`);
        }
    };    

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="wasteType">Select Waste Type:</label>
            <select
                id="wasteType"
                value={wasteType}
                onChange={(e) => {
                    setWasteType(e.target.value);
                }}
                required
            >
                <option value="" disabled>
                    Select Waste Type
                </option>
                {wasteOptions.map((option, index) => (
                    <option key={index} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>

            <label htmlFor="amount">Amount:</label>
            <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
            />

            <button type="submit">Upload</button>
        </form>
    );
};

export default WasteForm;
