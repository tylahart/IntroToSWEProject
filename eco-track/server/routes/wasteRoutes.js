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

router.get('/waste/breakdown', authenticateToken, async (req, res) => {
    console.log('Request received at /waste/breakdown');
    try {
        const entries = await WasteEntry.find({ userId: req.user.userId });
        console.log('Fetched entries:', entries);

        const breakdown = {};
        entries.forEach((entry) => {
            if (breakdown[entry.type]) {
                breakdown[entry.type] += entry.amount * entry.weight;
            } else {
                breakdown[entry.type] = entry.amount * entry.weight;
            }
        });

        const result = Object.entries(breakdown).map(([type, totalWeight]) => ({
            type,
            totalWeight,
        }));

        console.log('Calculated breakdown:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error calculating waste breakdown:', error);
        res.status(500).json({ message: 'Failed to calculate waste breakdown' });
    }
});


router.get('/waste/output', authenticateToken, async (req, res) => {
    try {
        // Get the current date and set time to 00:00:00 for filtering
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Debug logs for date range
        console.log('Start of Day:', startOfDay);
        console.log('End of Day:', endOfDay);

        // Fetch waste entries for the user within the current day
        const entries = await WasteEntry.find({
            userId: req.user.userId,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        // Debug log for filtered entries
        console.log('Filtered Entries:', entries);

        // Calculate the waste output: sum of (amount * weight)
        const wasteOutput = entries.reduce((sum, entry) => {
            const itemOutput = entry.amount * entry.weight; // Calculate for each item
            return sum + itemOutput; // Add to the running total
        }, 0);

        // Return only the waste output for the current day
        res.status(200).json({ wasteOutput });
    } catch (error) {
        console.error('Error calculating waste output:', error);
        res.status(500).json({ message: 'Failed to calculate waste output' });
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

        // Save the new waste entry
        const wasteEntry = new WasteEntry({
            wasteType,
            amount,
            weight: Number(weight), // Include weight
            type, // Include type
            userId: req.user.userId, // Attach the user's ID
        });

        const savedEntry = await wasteEntry.save();

        // Calculate the updated waste output for the user
        const entries = await WasteEntry.find({ userId: req.user.userId });
        const updatedWasteOutput = entries.reduce((sum, entry) => {
            const itemOutput = entry.amount * entry.weight; // Calculate for each item
            return sum + itemOutput; // Add to the running total
        }, 0);

        res.status(201).json({
            message: 'Waste entry added successfully.',
            savedEntry,
            updatedWasteOutput, // Include the updated waste output in the response
        });
    } catch (error) {
        console.error('Error saving waste entry:', error);
        res.status(500).json({ message: 'Failed to save waste entry', error: error.message });
    }
});


module.exports = router;