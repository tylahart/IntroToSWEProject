import React, { useState } from 'react';
import { uploadWasteData } from '../api/wasteService';

const WasteForm = () => {
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert('You must be logged in to upload waste data.');
                return;
            }

            console.log('Token found:', token);

            await uploadWasteData({ wasteType, amount });

            alert("Waste data uploaded successfully!");
            // Reset form on success
            setWasteType('');
            setAmount('');
        } catch (error) {
            console.error('Error during waste data upload:', error.response?.data || error.message);
            alert(`Failed to upload data: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                placeholder="Waste Type"
                required
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Item Count"
                required
            />
            <button type="submit">Upload</button>
        </form>
    );
};

export default WasteForm;
