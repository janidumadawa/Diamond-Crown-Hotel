const cloudinary = require('cloudinary').v2;

// Log environment variables for debugging (remove in production if sensitive)
console.log('🔧 Cloudinary Config Check:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test Cloudinary connection with better error handling
const testCloudinaryConnection = async () => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables are missing');
    }
    
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    // Don't crash the app if Cloudinary fails
    console.log('⚠️  Continuing without Cloudinary - file uploads will fail');
    return false;
  }
};

// Call the connection test
testCloudinaryConnection();

module.exports = cloudinary;