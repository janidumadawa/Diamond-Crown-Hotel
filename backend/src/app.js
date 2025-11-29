// backend/src/app.js
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

// CORS configuration
// app.use(cors({
//     origin: process.env.CLIENT_URL || 'http://localhost:3000', // Add fallback
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
// }));


// CORS configuration
app.use(cors({
    origin: [
        'https://diamond-crown-hotel.vercel.app', // Your Vercel app
        'https://*.vercel.app', // All Vercel subdomains
        'https://*.up.railway.app', // All Railway subdomains
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
    exposedHeaders: ['Set-Cookie']
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

// Test cookie endpoint
app.get('/api/test-cookie', (req, res) => {
    res.cookie('test_cookie', 'working', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    res.json({ 
        success: true, 
        message: 'Cookie should be set',
        environment: process.env.NODE_ENV
    });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;