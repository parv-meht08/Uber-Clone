require('dotenv').config();
const mongoose = require('mongoose');
const captainModel = require('../models/captain.model');

async function addTestCaptain() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB');

        // Create test captain
        const testCaptain = new captainModel({
            fullname: {
                firstname: 'Test',
                lastname: 'Captain'
            },
            email: 'test.captain@example.com',
            password: 'password123',
            status: 'active',
            vehicle: {
                color: 'White',
                plate: 'GJ-01-XX-1234',
                capacity: 4,
                vehicleType: 'car'
            },
            location: {
                type: 'Point',
                coordinates: [72.8611, 22.6916] // Nadiad coordinates
            }
        });

        // Hash password before saving
        testCaptain.password = await testCaptain.hashPassword(testCaptain.password);

        // Save captain
        await testCaptain.save();
        console.log('Test captain added successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error adding test captain:', error);
        process.exit(1);
    }
}

addTestCaptain();
