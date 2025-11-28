// backend/src/models/Amenity.js
const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter amenity title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter amenity description']
    },
    image: {
        type: String,
        required: [true, 'Please upload an image']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Amenity', amenitySchema);