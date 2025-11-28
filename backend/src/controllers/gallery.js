const Gallery = require('../models/Gallery');
const ErrorHandler = require('../utils/errorHandler');
const fs = require('fs');
const path = require('path');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
exports.getGalleryImages = async (req, res, next) => {
  try {
    const images = await Gallery.find().sort('displayOrder');
    
    res.status(200).json({
      success: true,
      images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create gallery image (Admin)
// @route   POST /api/admin/gallery
// @access  Private/Admin
exports.createGalleryImage = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return next(new ErrorHandler('Please upload an image', 400));
    }

    const image = await Gallery.create({
      title,
      image: req.file.filename
    });

    res.status(201).json({
      success: true,
      image
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image (Admin)
// @route   DELETE /api/admin/gallery/:id
// @access  Private/Admin
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return next(new ErrorHandler('Image not found', 404));
    }

    // Delete image file from server
    const imagePath = path.join(__dirname, '../../uploads', image.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update image display order (Admin)
// @route   PUT /api/admin/gallery/order
// @access  Private/Admin
exports.updateImageOrder = async (req, res, next) => {
  try {
    const { images } = req.body;

    for (let i = 0; i < images.length; i++) {
      await Gallery.findByIdAndUpdate(images[i].id, { displayOrder: i });
    }

    res.status(200).json({
      success: true,
      message: 'Image order updated successfully'
    });
  } catch (error) {
    next(error);
  }
};