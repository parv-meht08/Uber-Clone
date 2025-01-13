const rideModel = require('../models/ride.model');
const crypto = require('crypto');

function generateConsistentDistance(pickUp, dest) {
    try {
        // Create a consistent hash from pickup and destination
        const locationString = `${pickUp}-${dest}`;
        const hash = crypto.createHash('md5').update(locationString).digest('hex');
        
        // Use first 4 digits of hash for more controlled distance
        const hashNum = parseInt(hash.substring(0, 4), 16);
        
        // Generate a distance between 2 and 50 km for better local rates
        const distance = 2 + (hashNum % 48); // This ensures distance is between 2 and 50
        
        // Calculate duration (assuming average speed of 30 km/h for realistic city traffic)
        const duration = Math.round((distance / 30) * 60); // Convert to minutes
        
        return { 
            distance: Math.round(distance), 
            duration: Math.round(duration) 
        };
    } catch (error) {
        console.error('Distance calculation error:', error);
        // Return default values if calculation fails
        return { distance: 5, duration: 10 };
    }
}

async function getFare(vehicleType, pickUp, dest) {
    try {
        const baseFare = {
            auto: 30,
            car: 50,
            bike: 20
        };

        const perKmRate = {
            auto: 10,
            car: 15,
            bike: 8
        };

        const { distance, duration } = generateConsistentDistance(pickUp, dest);

        // Basic fare calculation
        let fare = baseFare[vehicleType];
        
        // Add distance-based fare
        fare += distance * perKmRate[vehicleType];
        
        // Add time-based fare (₹1 per minute)
        fare += duration;
        
        // Round to nearest 10
        fare = Math.round(fare / 10) * 10;
        
        return {
            fare,
            distance,
            duration
        };
    } catch (error) {
        console.error('Fare calculation error:', error);
        throw error;
    }
}

module.exports.getFare = getFare;

function getOtp(num) {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

async function createRide({
    user,
    pickUp,
    dest,
    vehicleType,
    fare
}) {
    try {
        // Create new ride
        const ride = new rideModel({
            user,
            pickUp,
            dest,
            vehicleType,
            fare,
            otp: getOtp()
        });

        // Save ride
        await ride.save();

        return ride;
    } catch (error) {
        console.error('Error creating ride:', error);
        throw error;
    }
}

module.exports.createRide = createRide;
