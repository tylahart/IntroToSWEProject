const express = require('express');
const WasteEntry = require('../models/WasteEntry');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Route to get dropdown entries from the 'items' collection
router.get('/items', async (req, res) => {
    try {
        // Explicitly use the database named ';'
        const db = mongoose.connection.useDb(';'); // Specify the database name exactly as it appears
        const itemsCollection = db.collection('items');

        // Query the collection with a projection to fetch specific fields
        const entries = await itemsCollection
            .find({}, { projection: { item: 1, type: 1, weight: 1 } })
            .toArray();

        // Transform the response to include only necessary fields
        const transformedEntries = entries.map((entry) => ({
            item: entry.item, // Item name
            type: entry.type, // Type (stored but not displayed in dropdown)
            weight: entry.weight, // Weight (stored but not displayed in dropdown)
        }));

        res.status(200).json(transformedEntries); // Send the response
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

// Middleware to check auth
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid or expired token' });

        // Attach decoded payload to req.user
        req.user = { userId: decoded.userId, email: decoded.email };
        console.log('Decoded user in authenticateToken:', req.user); // Debug log
        next();
    });
}

router.get('/debug', authenticateToken, async (req, res) => {
    try {
        const entries = await WasteEntry.find({ userId: req.user.userId });
        console.log('Debug entries:', entries); // Log entries to see their structure
        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching debug entries:', error);
        res.status(500).json({ message: 'Failed to fetch debug entries' });
    }
});

// Route to get the total amount of waste for a user
router.get('/waste/amount', authenticateToken, async (req, res) => {
    try {
        // Fetch all waste entries for the user
        const entries = await WasteEntry.find({ userId: req.user.userId });

        // Calculate the total amount
        const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

        res.status(200).json({ totalAmount });
    } catch (error) {
        console.error('Error fetching total amount:', error);
        res.status(500).json({ message: 'Failed to fetch total amount' });
    }
});


// Route to get the total weight of waste for a user
router.get('/waste/weight', authenticateToken, async (req, res) => {
    try {
        // Fetch all waste entries for the user
        const entries = await WasteEntry.find({ userId: req.user.userId });

        // Calculate the total weight
        const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);

        res.status(200).json({ totalWeight });
    } catch (error) {
        console.error('Error fetching total weight:', error);
        res.status(500).json({ message: 'Failed to fetch total weight' });
    }
});

// Route to get the types of waste for a user
router.get('/waste/types', authenticateToken, async (req, res) => {
    try {
        const wasteTypes = await WasteEntry.find(
            { userId: req.user.userId }, // Match directly by userId (string)
            { type: 1, _id: 0 } // Only include the type field
        );
        res.status(200).json({ wasteTypes: wasteTypes.map(entry => entry.type) });
    } catch (error) {
        console.error('Error fetching waste types:', error);
        res.status(500).json({ message: 'Failed to fetch waste types' });
    }
});

// POST route to add a new waste entry
router.post('/addWaste', authenticateToken, async (req, res) => {
    try {
        console.log('Decoded user in /addWaste:', req.user);
        const { wasteType, amount, weight, type } = req.body;

        if (!wasteType || !amount || !weight || !type) {
            return res.status(400).json({ message: 'Waste type, amount, weight, and type are required.' });
        }

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'User authentication failed.' });
        }

        const wasteEntry = new WasteEntry({
            wasteType,
            amount,
            weight: Number(weight), // Include weight
            type, // Include type
            userId: req.user.userId, // Attach the user's ID
        });

        const savedEntry = await wasteEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error('Error saving waste entry:', error);
        res.status(500).json({ message: 'Failed to save waste entry', error: error.message });
    }
});

module.exports = router;