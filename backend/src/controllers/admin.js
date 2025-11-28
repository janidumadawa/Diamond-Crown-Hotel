// backend/src/controllers/admin.js
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Contact = require('../models/Contact');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    // Get total counts
    const totalBookings = await Booking.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Get today's check-ins and check-outs
    const todaysCheckIns = await Booking.countDocuments({
      checkIn: { $gte: startOfToday, $lte: endOfToday },
      status: { $in: ['confirmed', 'completed'] } // Include completed bookings
    });

    const todaysCheckOuts = await Booking.countDocuments({
      checkOut: { $gte: startOfToday, $lte: endOfToday },
      status: { $in: ['confirmed', 'completed'] } // Include completed bookings
    });

    // Get booking status counts
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Get revenue data (last 30 days) - Include BOTH confirmed AND completed bookings
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueBookings = await Booking.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $in: ['confirmed', 'completed'] } // Include both statuses for revenue
    });

    const totalRevenue = revenueBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // Get room occupancy rate - Include both confirmed and completed bookings
    const availableRooms = await Room.countDocuments({ available: true });
    const occupiedRooms = await Booking.countDocuments({
      status: { $in: ['confirmed', 'completed'] }, // Include completed bookings in occupancy
      checkIn: { $lte: endOfToday },
      checkOut: { $gte: startOfToday }
    });

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRooms,
        totalUsers,
        todaysCheckIns,
        todaysCheckOuts,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        completedBookings, // Add this to your stats
        totalRevenue,
        occupancyRate: Math.round(occupancyRate),
        availableRooms,
        occupiedRooms
      }
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get all bookings with filters
// @route   GET /api/admin/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, sort = '-createdAt' } = req.query;

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('room', 'name type price')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all rooms
// @route   GET /api/admin/rooms
// @access  Private/Admin
exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().sort('roomNumber');

    res.status(200).json({
      success: true,
      rooms
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Create a new room
//@route   POST /api/admin/rooms
//@access  Private/Admin
exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

//@desc    Delete a room
//@route   DELETE /api/admin/rooms/:id
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return next(new ErrorHandler('Room not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find({ role: 'user' })
      .select('name email phone createdAt')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ role: 'user' });

    res.status(200).json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/admin/rooms/:id
// @access  Private/Admin
exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!room) {
      return next(new ErrorHandler('Room not found', 404));
    }

    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email phone')
     .populate('room', 'name type price');

    if (!booking) {
      return next(new ErrorHandler('Booking not found', 404));
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};