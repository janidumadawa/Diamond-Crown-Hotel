// backend/src/controllers/auth.js
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/sendToken');


// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler('User already exists with this email', 400));
        }

        //create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        sendToken(user, 201, res);
    } catch (error) {
        next(error);
    }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return next(new ErrorHandler('Please provide email and password', 400));
        }

        //find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        //check if password matches
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        sendToken(user, 200, res);
    } catch (error) {
        next(error);
    }
};


// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            data: null
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,  // ← ADD THIS LINE
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, address } = req.body;

        // Find user
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return next(new ErrorHandler('Email already exists', 400));
            }
            user.email = email;
        }

        // Update fields
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        // Save updated user
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};