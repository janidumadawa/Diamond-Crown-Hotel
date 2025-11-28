// backend/src/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    checkIn: {
        type: Date,
        required: [true, 'Please enter check-in date']
    },
    checkOut: {
        type: Date,
        required: [true, 'Please enter check-out date']
    },
    guests: {
        type: Number,
        required: [true, 'Please enter number of guests'],
        min: [1, 'At least 1 guest required']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'refunded'],
        default: 'pending'
    },
    specialRequests: {
        type: String,
        maxLength: [500, 'Special requests cannot exceed 500 characters']
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient querying
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });

module.exports = mongoose.model('Booking', bookingSchema);