// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');

// Check if user is authenticated
exports.protect = async (req, res, next) => {
    let token;

    // FIRST: Check cookies (HTTP-only)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // SECOND: Check Authorization header (fallback)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorHandler('Access denied. No token provided.', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler('Invalid token', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};