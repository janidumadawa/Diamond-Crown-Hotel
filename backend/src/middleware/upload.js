const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

let storage;

// Check if Cloudinary is configured properly
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  console.log('✅ Using Cloudinary for file storage');
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'diamond-crown-hotel',
      format: async (req, file) => {
        const format = file.mimetype.split('/')[1];
        return ['png', 'jpg', 'jpeg', 'webp'].includes(format) ? format : 'png';
      },
      public_id: (req, file) => {
        const timestamp = Date.now();
        const originalName = file.originalname.split('.')[0];

        if (req.originalUrl.includes('amenities')) {
          return `amenity-${timestamp}-${originalName}`;
        } else if (req.originalUrl.includes('gallery')) {
          return `gallery-${timestamp}-${originalName}`;
        } else {
          return `room-${timestamp}-${originalName}`;
        }
      },
      transformation: [
        { width: 800, height: 600, crop: "limit" },
        { quality: "auto" },
        { format: "auto" }
      ]
    },
  });
} else {
  console.log('⚠️  Cloudinary not configured - using local storage as fallback');
  // Fallback to local storage
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

module.exports = upload;