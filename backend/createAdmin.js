const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', {
      name: String,
      email: String,
      password: String,
      phone: String,
      role: String,
      createdAt: Date,
      updatedAt: Date
    });

    // Clear existing admin
    await User.deleteOne({ email: 'admin@diamondcrown.com' });

    // Hash the password properly
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create new admin
    await User.create({
      name: 'Admin User',
      email: 'admin@diamondcrown.com',
      password: hashedPassword,
      phone: '+94112345678',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Admin user created!');
    console.log('Email: admin@diamondcrown.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createAdmin();
