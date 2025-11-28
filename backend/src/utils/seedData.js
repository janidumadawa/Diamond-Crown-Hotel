import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';
import User from '../models/User.js';

dotenv.config();

const rooms = [
    {
        roomNumber: 'D101',
        name: 'City View Deluxe Room',
        type: 'Deluxe Room',
        price: 20000,
        size: '420 sq ft',
        capacity: 2,
        maxGuests: 2,
        description: "Enjoy comfortable modern décor and sweeping views of Colombo's skyline from this Deluxe Room.",
        features: [
            'King Size Bed',
            'City View',
            'Smart TV',
            'Mini Bar',
            'Free WiFi',
            'Air Conditioning',
            'Ensuite Bathroom'
        ],
        images: ['/images/rooms/Classic-elegance-suite-room.jpg'],
        available: true
    },
    {
        roomNumber: 'P201',
        name: 'Ocean View Premier Room',
        type: 'Premier Room',
        price: 30000,
        size: '500 sq ft',
        capacity: 2,
        maxGuests: 3,
        description: "Relax in our Premier Room featuring an ocean-facing balcony and premium amenities for a memorable stay.",
        features: [
            'Super King Bed',
            'Private Balcony',
            'Ocean View',
            'Work Desk',
            '24/7 Room Service',
            'Coffee Maker',
            'Luxury Toiletries'
        ],
        images: ['/images/rooms/Diamond-Premier-Room.jpg'],
        available: true
    },
    {
        roomNumber: 'S301',
        name: 'Executive Suite',
        type: 'Executive Suite',
        price: 55000,
        size: '900 sq ft',
        capacity: 2,
        maxGuests: 4,
        description: "Our Executive Suite offers spacious luxury with distinct living and sleeping zones, ideal for families or longer stays.",
        features: [
            'Separate Living Area',
            'Ocean & City View',
            'Jacuzzi Bath',
            'Dining Table',
            'Butler Service',
            'Nespresso Machine',
            'Walk-in Closet'
        ],
        images: ['/images/rooms/RoyalCrownVilla.jpg'],
        available: true
    },
    {
        roomNumber: 'B401',
        name: 'Business Workspace Suite',
        type: 'Business Suite',
        price: 40000,
        size: '600 sq ft',
        capacity: 2,
        maxGuests: 2,
        description: "Tailored for the business traveller, this suite features a full work zone and premium comforts to support productivity.",
        features: [
            'Dedicated Workspace',
            'Meeting Area',
            'Express WiFi',
            'Complimentary Breakfast',
            'Airport Transfer',
            'Printer/Scanner',
            'Ergonomic Chair'
        ],
        images: ['/images/rooms/Serenity-Business-Suite.jpg'],
        available: true
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Room.deleteMany();
        console.log('✅ Cleared existing rooms');

        await User.deleteMany({ 
            email: { 
                $in: ['admin@diamondcrown.com', 'user@example.com'] 
            } 
        });
        console.log('✅ Cleared existing test users');

        // Insert new rooms
        await Room.insertMany(rooms);
        console.log('✅ Rooms seeded successfully');

        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@diamondcrown.com',
            password: 'admin123',
            phone: '+94112345678',
            role: 'admin'
        });
        console.log('✅ Admin user created');

        // Create a test regular user
        await User.create({
            name: 'Test User',
            email: 'user@example.com',
            password: 'password123',
            phone: '+94119876543',
            role: 'user'
        });
        console.log('✅ Test user created');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('====================');
        console.log('👑 Admin Account:');
        console.log('   Email: admin@diamondcrown.com');
        console.log('   Password: admin123');
        console.log('\n👤 Test User Account:');
        console.log('   Email: user@example.com');
        console.log('   Password: password123');
        console.log('\n🚀 You can now login to the application!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed directly when file is executed
if (process.argv[1] === new URL(import.meta.url).pathname) {
    seedDatabase();
}

export default seedDatabase;