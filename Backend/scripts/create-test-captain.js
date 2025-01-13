require('dotenv').config();
const mongoose = require('mongoose');
const captainModel = require('../models/captain.model');

async function createTestCaptain() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log('Connected to MongoDB');

        // Create test captain data
        const testCaptain = {
            fullname: {
                firstname: "Test",
                lastname: "Captain"
            },
            email: "testcaptain@test.com",
            password: "testpassword123",
            status: "active",
            vehicle: {
                color: "White",
                model: "Swift",
                number: "GJ01AB1234",
                vehicleType: "car",
                capacity: 4,
                plate: "GJ01AB1234"
            },
            location: {
                type: "Point",
                coordinates: [72.5714, 23.0225] // Ahmedabad coordinates
            }
        };

        // Check if captain already exists
        const existingCaptain = await captainModel.findOne({ email: testCaptain.email });
        if (existingCaptain) {
            console.log('Test captain already exists');
            return;
        }

        // Create new captain
        const captain = new captainModel(testCaptain);
        await captain.save();
        console.log('Test captain created successfully');

    } catch (error) {
        console.error('Error creating test captain:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createTestCaptain();
