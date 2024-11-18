const express = require('express');
const WasteEntry = require('../models/WasteEntry');
const router = express.Router();

// POST route to add a new waste entry
router.post('/addWaste', async (req, res) => {
    try {
        const wasteEntry = new WasteEntry(req.body);
        const savedEntry = await wasteEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;