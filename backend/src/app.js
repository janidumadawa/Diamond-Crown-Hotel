const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

//  TRUST PROXY (Vercel)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

//  CORS CONFIG
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://diamond-crown-hotel.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

//  MIDDLEWARES
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  STATIC FILES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

//  TEST ROUTES
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Diamond Crown Hotel API is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-cookie', (req, res) => {
  res.cookie('test_cookie', 'working', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    environment: process.env.NODE_ENV
  });
});

//  ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/amenities', require('./routes/amenities'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));

// 404 HANDLER
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

//  ERROR MIDDLEWARE
const errorMiddleware = require('./middleware/error');
app.use(errorMiddleware);

module.exports = app;
