const Gallery = require('../models/Gallery');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('../config/cloudinary');

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

    console.log('Gallery upload - Cloudinary file:', req.file);
    console.log('Gallery upload - Cloudinary URL:', req.file.path);

    const image = await Gallery.create({
      title,
      image: req.file.path // Cloudinary URL
    });

    res.status(201).json({
      success: true,
      image
    });
  } catch (error) {
    console.error('Create gallery image error:', error);
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

    // Delete image from Cloudinary if it's a Cloudinary URL
    if (image.image && image.image.includes('cloudinary.com')) {
      try {
        // Extract public_id from Cloudinary URL
        const urlParts = image.image.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `diamond-crown-hotel/${publicId}`;
        
        console.log('Deleting from Cloudinary:', fullPublicId);
        await cloudinary.uploader.destroy(fullPublicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary delete fails
      }
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery image error:', error);
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