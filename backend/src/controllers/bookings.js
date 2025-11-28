// backend/src/controllers/bookings.js
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const ErrorHandler = require('../utils/errorHandler');

// Helper function to calculate total price
const calculateTotalPrice = (roomPrice, checkIn, checkOut) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((checkOut - checkIn) / oneDay));
    return roomPrice * diffDays;
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { roomId, checkIn, checkOut, guests, specialRequests } = req.body;

        // Validate dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            return next(new ErrorHandler('Check-in date cannot be in the past', 400));
        }

        if (checkOutDate <= checkInDate) {
            return next(new ErrorHandler('Check-out date must be after check-in date', 400));
        }

        // Find room
        const room = await Room.findById(roomId);
        if (!room) {
            return next(new ErrorHandler('Room not found', 404));
        }

        if (!room.available || room.maintenance) {
            return next(new ErrorHandler('Room is not available for booking', 400));
        }

        if (guests > room.maxGuests) {
            return next(new ErrorHandler(`Room can accommodate maximum ${room.maxGuests} guests`, 400));
        }

        // Check if room is available for the selected dates
        const existingBooking = await Booking.findOne({
            room: roomId,
            $or: [
                {
                    checkIn: { $lte: checkOutDate },
                    checkOut: { $gte: checkInDate },
                    status: { $in: ['confirmed', 'pending'] }
                }
            ]
        });

        if (existingBooking) {
            return next(new ErrorHandler('Room is not available for the selected dates', 400));
        }

        // Calculate total price
        const totalPrice = calculateTotalPrice(room.price, checkInDate, checkOutDate);

        // Create booking
        const booking = await Booking.create({
            user: req.user.id,
            room: roomId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            totalPrice,
            specialRequests
        });

        // Populate room details in response
        await booking.populate('room');

        res.status(201).json({
            success: true,
            booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate('room')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('room');

        if (!booking) {
            return next(new ErrorHandler('Booking not found', 404));
        }

        // Make sure user owns the booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler('Not authorized to access this booking', 403));
        }

        res.status(200).json({
            success: true,
            booking
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.cancelBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return next(new ErrorHandler('Booking not found', 404));
        }

        // Make sure user owns the booking or is admin
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorHandler('Not authorized to cancel this booking', 403));
        }

        // Check if booking can be cancelled (at least 1 day before check-in)
        const checkInDate = new Date(booking.checkIn);
        const today = new Date();
        const timeDiff = checkInDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        if (daysDiff < 1) {
            return next(new ErrorHandler('Bookings can only be cancelled at least 1 day before check-in', 400));
        }

        booking.status = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            booking
        });
    } catch (error) {
        next(error);
    }
};