const rideModel = require('../models/ride.model');

async function getFare(vehicleType) {
    const baseFare = {
        auto: 20,
        car: 50,
        moto: 15,
    };

    const perKmRate = {
        auto: 10,
        car: 20,
        moto: 8,
    };

    const randomDistance = Math.floor(Math.random() * 20) + 1; // Simulating distance in km
    const randomDuration = Math.floor(Math.random() * 30) + 5; // Simulating duration in minutes

    const fare = Math.round(
        baseFare[vehicleType] +
        randomDistance * perKmRate[vehicleType] +
        randomDuration * 2 // Assuming a per-minute rate of 2
    );

    return { fare, distance: randomDistance, duration: randomDuration };
}

module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType,
}) => {
    const { fare, distance, duration } = await getFare(vehicleType);

    const ride = new rideModel({
        user,
        pickup,
        destination,
        fare,
        distance,
        duration,
    });

    await ride.save();
    return ride;
};
