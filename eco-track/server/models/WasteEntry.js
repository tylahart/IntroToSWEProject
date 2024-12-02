const mongoose = require('mongoose');

const wasteEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // associate user w waste entry
    wasteType: { type: String, required: true }, // plastic, food waste
    amount: { type: Number, required: true }, // in grams or kilograms
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WasteEntry', wasteEntrySchema);