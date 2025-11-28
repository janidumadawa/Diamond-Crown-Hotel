const Amenity = require('../models/Amenity');
const ErrorHandler = require('../utils/errorHandler');

// @desc    Get all amenities
// @route   GET /api/admin/amenities
// @access  Private/Admin
exports.getAmenities = async (req, res, next) => {
    try {
        const amenities = await Amenity.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: amenities.length,
            amenities
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create amenity
// @route   POST /api/admin/amenities
// @access  Private/Admin
exports.createAmenity = async (req, res, next) => {
    try {
        console.log('Create amenity request received');
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);

        const { title, description } = req.body;

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Use Cloudinary URL directly from req.file.path
        const image = req.file.path;
        console.log('Cloudinary image URL:', image);

        const amenity = await Amenity.create({
            title,
            description,
            image
        });

        res.status(201).json({
            success: true,
            amenity
        });
    } catch (error) {
        console.error('Create amenity error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update amenity
// @route   PUT /api/admin/amenities/:id
// @access  Private/Admin
exports.updateAmenity = async (req, res, next) => {
    try {
        let amenity = await Amenity.findById(req.params.id);

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        const { title, description } = req.body;
        const updateData = { title, description };

        // If new image is uploaded to Cloudinary
        if (req.file) {
            updateData.image = req.file.path; // Cloudinary URL
            console.log('Updated Cloudinary image URL:', updateData.image);
        }

        amenity = await Amenity.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            amenity
        });
    } catch (error) {
        console.error('Update amenity error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete amenity
// @route   DELETE /api/admin/amenities/:id
// @access  Private/Admin
exports.deleteAmenity = async (req, res, next) => {
    try {
        const amenity = await Amenity.findById(req.params.id);

        if (!amenity) {
            return res.status(404).json({
                success: false,
                message: 'Amenity not found'
            });
        }

        await Amenity.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Amenity deleted successfully'
        });
    } catch (error) {
        console.error('Delete amenity error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};