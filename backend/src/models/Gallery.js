// backend/src/models/Gallery.js
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the image'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  image: {
    type: String,
    required: [true, 'Please upload an image']
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Set display order before saving
gallerySchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Gallery').countDocuments();
    this.displayOrder = count;
  }
  next();
});

module.exports = mongoose.model('Gallery', gallerySchema);