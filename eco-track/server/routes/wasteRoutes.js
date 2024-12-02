const express = require('express');
const WasteEntry = require('../models/WasteEntry');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

// POST route to add a new waste entry
router.post('/addWaste', authenticateToken, async (req, res) => {
    try {
        console.log('Decoded user in /addWaste:', req.user);
        const { wasteType, amount } = req.body;

        if (!wasteType || !amount) {
            return res.status(400).json({ message: 'Waste type and amount are required.' });
        }

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'User authentication failed.' });
        }

        const wasteEntry = new WasteEntry({
            wasteType,
            amount,
            userId: req.user.userId // This gets the user's ID from the token
        });
        
        const savedEntry = await wasteEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error('Error saving waste entry:', error);
        res.status(500).json({ message: 'Failed to save waste entry', error: error.message });
    }
});

module.exports = router;