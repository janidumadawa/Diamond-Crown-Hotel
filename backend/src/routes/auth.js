// backend/src/routes/auth.js
const express = require('express');
const { register, login, logout, getMe, updateProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);

module.exports = router;