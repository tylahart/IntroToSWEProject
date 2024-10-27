import React, { useState } from 'react';
import { uploadWasteData } from '../api/wasteService';

const WasteForm = () => {
    const [user, setUser] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await uploadWasteData({ user, wasteType, amount });
            alert("Waste data uploaded successfully!");
        } catch (error) {
            alert("Failed to upload data.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="User" required />
            <input type="text" value={wasteType} onChange={(e) => setWasteType(e.target.value)} placeholder="Waste Type" required />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" required />
            <button type="submit">Upload</button>
        </form>
    );
};

export default WasteForm;
