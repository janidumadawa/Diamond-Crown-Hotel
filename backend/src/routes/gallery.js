// backend/src/routes/gallery.js
const express = require('express');
const {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  updateImageOrder
} = require('../controllers/gallery');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', upload.single('image'), createGalleryImage);
router.delete('/:id', deleteGalleryImage);
router.put('/order', updateImageOrder);

module.exports = router;