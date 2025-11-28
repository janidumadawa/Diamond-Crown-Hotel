const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // ADD THIS

// Load environment variables
dotenv.config();

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const amenityRoutes = require('./routes/amenities');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');

// Import error middleware
const errorMiddleware = require('./middleware/error');

const app = express();

// ADD COOKIE PARSER - THIS IS CRITICAL
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// FIX CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Add fallback
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Test route
app.get('/api/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Diamond Crown Hotel API is working!',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// Handle undefined routes
app.all('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;