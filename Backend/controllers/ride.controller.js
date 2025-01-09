const rideService = require('../services/newRide.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
        });

        return res.status(201).json(ride);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        // Get fares for all vehicle types
        const carFare = await rideService.getFare('car', pickup, destination);
        const autoFare = await rideService.getFare('auto', pickup, destination);
        const motoFare = await rideService.getFare('moto', pickup, destination);

        return res.status(200).json({
            car: carFare,
            // Only include auto fare if it's available
            auto: autoFare.fare !== null ? autoFare : { 
                fare: "Not Available", 
                distance: autoFare.distance,
                duration: autoFare.duration,
                message: autoFare.message 
            },
            moto: motoFare,
            pickup,
            destination
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}