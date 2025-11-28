// backend/src/controllers/rooms.js

const Room = require("../models/Room");
const Booking = require("../models/Booking");
const ErrorHandler = require("../utils/errorHandler");
const { count } = require("../models/User");

// @desc    get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, type, guests } = req.query;

    let query = { available: true, maintenance: false };

    // Filter by room type
    if (type && type !== "all") {
      query.type = type;
    }

    //filter by capacity
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    let rooms = await Room.find(query);

    //filter by availability if dates are provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      //find rooms that have conflicting bookings
      const conflictingBookings = await Booking.find({
        $or: [
          {
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate },
            status: { $in: ["confirmed", "pending"] },
          },
        ],
      });

      const bookedRoomIds = conflictingBookings.map((booking) =>
        booking.room.toString()
      );

      rooms = rooms.filter(
        (room) => !bookedRoomIds.includes(room._id.toString())
      );
    }

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    get single room details
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    create room (Admin only)
// @route   POST /api/rooms
// @access  Private/Admin
exports.createRoom = async (req, res, next) => {
  try {
    const roomData = { ...req.body };

    console.log("Received room data:", roomData);
    console.log("Uploaded files:", req.files);

    // Handle Cloudinary file uploads
    if (req.files && req.files.length > 0) {
      // Cloudinary already uploaded files, get URLs from req.files
      const cloudinaryUrls = req.files.map(file => file.path);
      roomData.images = [...(roomData.images || []), ...cloudinaryUrls];
      
      console.log("Cloudinary image URLs:", cloudinaryUrls);
    }

    // Parse images if they come as JSON string
    if (typeof roomData.images === 'string') {
      try {
        roomData.images = JSON.parse(roomData.images);
      } catch (e) {
        roomData.images = [roomData.images];
      }
    }

    console.log("Final room data before save:", roomData);

    const room = await Room.create(roomData);

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);
    next(error);
  }
};

// @desc    update room (Admin only)
// @route   PUT /api/rooms/:id
// @access  Private/Admin
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return next(new ErrorHandler("Room not found", 404));
    }

    const roomData = { ...req.body };

    // Handle Cloudinary file uploads for updates
    if (req.files && req.files.length > 0) {
      const cloudinaryUrls = req.files.map(file => file.path);
      roomData.images = [...(room.images || []), ...cloudinaryUrls];
    }

    // Parse images if they come as JSON string
    if (typeof roomData.images === 'string') {
      try {
        roomData.images = JSON.parse(roomData.images);
      } catch (e) {
        roomData.images = [roomData.images];
      }
    }

    room = await Room.findByIdAndUpdate(req.params.id, roomData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadImage = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.status(200).json({ success: true, urls });
};
