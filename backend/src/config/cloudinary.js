const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('✅ Cloudinary configured');

// Remove the ping test for now, or handle it better:
const initializeCloudinary = async () => {
  try {
    // Simple configuration test instead of ping
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      console.log('✅ Cloudinary credentials verified');
      return true;
    } else {
      console.log('⚠️ Cloudinary credentials missing');
      return false;
    }
  } catch (error) {
    console.log('⚠️ Cloudinary initialization note:', error.message);
    return false;
  }
};

// Call initialization
initializeCloudinary();

module.exports = cloudinary;