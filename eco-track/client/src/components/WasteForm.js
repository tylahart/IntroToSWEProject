import React, { useState } from 'react';
import { uploadWasteData } from '../api/wasteService';

const WasteForm = () => {
    const [user, setUser] = useState('');
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

            await uploadWasteData({ user, wasteType, amount });

            alert('Waste data uploaded successfully!');
            setUser('');
            setWasteType('');
            setAmount('');
        } catch (error) {
            console.error('Error during waste data upload:', error.response?.data || error.message);
            alert(`Failed to upload data: ${error.response?.data?.message || error.message}`);
        }
    };

    const wasteOptions = [
        "Water bottle", "Soda can", "Cardboard box", "Banana peel", "Pizza box", "Coffee cup", 
        "Styrofoam cup", "Plastic straw", "Chip bag", "Newspaper", "Egg carton", "Aluminum foil", 
        "Tissues", "Paper towels", "Toothpaste tube", "Shampoo bottle", "Toothbrush", "Plastic bag", 
        "Milk carton", "Plastic fork", "Plastic knife", "Food wrapper", "Paper napkin", "Candy wrapper", 
        "Bottled juice", "Glass bottle", "Plastic wrap", "Coffee lid", "Styrofoam takeout box", 
        "Cigarette butts", "Plastic packaging", "Plastic cup", "Nail polish bottle", "Disposable razor", 
        "Diaper", "Broken ceramic plate", "Broken glass", "Paper cup", "Plastic lids", "Parchment paper", 
        "Broken plastic toy", "Old socks", "Wrapping paper", "Ribbon", "Styrofoam tray", "Paper plate", 
        "Paint cans", "Hair dye container", "Ink cartridges", "Bleach bottle", "Motor oil bottle", 
        "Batteries", "Fluorescent light bulb", "Medicine bottle", "Carbonated beverage bottle", 
        "Milk jug", "Newspaper insert", "Condiment packets", "Fast food bag", "Tea bag", "Paper envelope", 
        "Dry cleaner bag", "Plastic laundry detergent bottle", "Lotion bottle", "Juice box", "Takeout menu", 
        "Paper bag", "Broken phone case", "Broken umbrella", "Bubble gum wrapper", "Used coffee filter", 
        "Food carton", "Paper straw", "Used cotton ball", "Plastic coffee pod", "Empty soda bottle", 
        "Used cloth napkin", "Vacuum cleaner bag", "Toothpaste box", "Old shoes", "Carpet scraps", 
        "Old computer mouse", "Dead plant", "Broken lamp", "Used dish sponge", "Old books", "Old backpack", 
        "Used batteries", "Clamshell food container", "Plastic hanger", "Old towels", "Broken mirror", 
        "Old phone"
    ];

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="User"
                required
            />
            <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                required
            >
                <option value="" disabled>Select Waste Type</option>
                {wasteOptions.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <input
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
