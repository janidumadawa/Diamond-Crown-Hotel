// backend/src/routes/rooms.js
const express = require('express');
const { getRooms, getRoom, createRoom, updateRoom } = require('../controllers/rooms');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
    .get(getRooms)
    .post(protect, 
        authorize('admin'), 
        upload.array('images', 5), 
        createRoom
    );

router.route('/:id')
    .get(getRoom)
    .put(protect, 
        authorize('admin'), 
        upload.array('images', 5),
        updateRoom
    );

module.exports = router;