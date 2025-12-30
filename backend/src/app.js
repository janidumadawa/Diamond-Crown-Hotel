const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

const app = express();

// ========== 1. CORS MUST BE FIRST ==========
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://diamond-crown-hotel.vercel.app' 
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Enable CORS for all routes - THIS MUST BE FIRST!
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// ========== 2. Then cookie parser ==========
app.use(cookieParser());

// ========== 3. Then static files ==========
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// ========== 4. Then body parsers ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/api/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Diamond Crown Hotel API is working!',
        timestamp: new Date().toISOString()
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

// Import routes
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const amenityRoutes = require('./routes/amenities');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');

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

// Import error middleware
const errorMiddleware = require('./middleware/error');
app.use(errorMiddleware);

// For Vercel serverless functions
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

module.exports = app;