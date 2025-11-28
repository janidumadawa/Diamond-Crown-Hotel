// backend/src/models/Room.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: [true, 'Please enter room number'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Please enter room name'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please enter room type'],
        enum: ['Deluxe Room', 'Premier Room', 'Executive Suite', 'Business Suite', 'Standard Room']
    },
    price: {
        type: Number,
        required: [true, 'Please enter room price'],
        min: [0, 'Price cannot be negative']
    },
    size: {
        type: String,
        required: [true, 'Please enter room size']
    },
    capacity: {
        type: Number,
        required: [true, 'Please enter room capacity'],
        min: [1, 'Capacity must be at least 1']
    },
    maxGuests: {
        type: Number,
        required: [true, 'Please enter maximum guests'],
        min: [1, 'Maximum guests must be at least 1']
    },
    description: {
        type: String,
        required: [true, 'Please enter room description']
    },
    features: [{
        type: String
    }],
    images: [{
        type: String
    }],
    available: {
        type: Boolean,
        default: true
    },
    maintenance: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);