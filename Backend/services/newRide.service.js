const rideModel = require('../models/ride.model');
const crypto = require('crypto');

function generateConsistentDistance(pickup, destination) {
    try {
        // Create a consistent hash from pickup and destination
        const locationString = `${pickup}-${destination}`;
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

async function getFare(vehicleType, pickup, destination) {
    try {
        const baseFare = {
            auto: 30,
            car: 50,
            moto: 20
        };

        const perKmRate = {
            auto: 10,
            car: 15,
            moto: 8
        };

        const { distance, duration } = generateConsistentDistance(pickup, destination);

        // Basic fare calculation
        let fare = baseFare[vehicleType];
        
        // Add distance-based fare
        fare += distance * perKmRate[vehicleType];
        
        // Add time-based charge (₹1 per minute)
        fare += duration * 1;

        // Auto rickshaws typically don't do long distances
        if (vehicleType === 'auto' && distance > 25) {
            return { 
                fare: null, 
                distance, 
                duration,
                message: "Auto rickshaws are only available for trips up to 25 km" 
            };
        }

        // Ensure fare is never negative or NaN
        fare = Math.max(0, Math.round(fare));
        
        if (isNaN(fare)) {
            throw new Error('Invalid fare calculation');
        }

        return { 
            fare, 
            distance, 
            duration 
        };
    } catch (error) {
        console.error('Fare calculation error:', error);
        throw new Error('Error calculating fare');
    }
}

module.exports.getFare = getFare;

function getOtp(num) {
    const otp = crypto.randomInt(0, Math.pow(10, num)).toString().padStart(num, '0');
    return otp;
}

module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
}) => {
    const { fare, distance, duration } = await getFare(vehicleType, pickup, destination);

    const ride = new rideModel({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare,
        distance,
        duration,
    });

    await ride.save();
    return ride;
};
