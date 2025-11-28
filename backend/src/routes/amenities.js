// backend/src/routes/amenities.js
const express = require('express');
const Amenity = require('../models/Amenity');

const router = express.Router();

// @desc    Get all amenities (Public)
// @route   GET /api/amenities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const amenities = await Amenity.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: amenities.length,
            amenities
        });
    } catch (error) {
        console.error('Get amenities error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


module.exports = router;