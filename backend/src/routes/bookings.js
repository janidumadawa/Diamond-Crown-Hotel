const express = require('express');
const { createBooking, getBookings, getBooking, cancelBooking } = require('../controllers/bookings');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .post(protect, createBooking)
    .get(protect, getBookings);

router.route('/:id')
    .get(protect, getBooking)
    .put(protect, cancelBooking);

module.exports = router;