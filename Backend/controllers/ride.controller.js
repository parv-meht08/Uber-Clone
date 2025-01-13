const rideService = require("../services/newRide.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../models/ride.model");
const captainModel = require("../models/captain.model");

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const findAvailableCaptains = async (lng, lat, radiusInMeters, vehicleType) => {
  try {
    const captains = await captainModel
      .find({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: radiusInMeters,
          },
        },
        status: "active",
        "vehicle.vehicleType": vehicleType,
        socketId: { $exists: true, $ne: null } // Only get captains with valid socket IDs
      })
      .exec();

    return captains;
  } catch (error) {
    console.error("Error finding captains:", error);
    return [];
  }
};

const retryFindingCaptains = async (lng, lat, radiusInMeters, vehicleType, retries = 0) => {
  const captains = await findAvailableCaptains(lng, lat, radiusInMeters, vehicleType);
  
  if (captains.length > 0) {
    return captains;
  }

  if (retries < MAX_RETRIES) {
    console.log(`No captains found with socket IDs, retry ${retries + 1} of ${MAX_RETRIES}`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retryFindingCaptains(lng, lat, radiusInMeters, vehicleType, retries + 1);
  }

  return [];
};

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pickUp, dest, vehicleType, fare } = req.body;

    // Create a new ride
    const ride = await rideService.createRide({
      pickUp,
      dest,
      vehicleType,
      fare,
      user: req.user._id,
    });

    // Get pickup coordinates
    const pickupCoordinates = await mapService.getAddressCoordinates(pickUp);
    if (!pickupCoordinates) {
      return res.status(400).json({ message: "Invalid pickup location" });
    }

    const { ltd: lat, lng } = pickupCoordinates;
    console.log("Pickup coordinates:", { lat, lng });

    const radiusInMeters = 5000; // 5 kilometer radius
    console.log("Fetching captains with parameters:", { lng, lat, radiusInMeters });

    // Find captains with retries
    const captains = await retryFindingCaptains(lng, lat, radiusInMeters, vehicleType);

    if (captains.length === 0) {
      await rideModel.findByIdAndUpdate(ride._id, { status: 'cancelled', cancelReason: 'No available captains' });
      return res.status(404).json({ 
        message: "No available captains found",
        ride: { ...ride.toObject(), status: 'cancelled' }
      });
    }

    // Send ride request to all available captains
    let sentToCount = 0;
    for (const captain of captains) {
      if (captain.socketId) {
        console.log(`Sending ride request to captain ${captain._id} (${captain.fullname.firstname}) via socket ${captain.socketId}`);
        sendMessageToSocketId(captain.socketId, 'new-ride', {
          ...ride.toObject(),
          captain: {
            id: captain._id,
            name: `${captain.fullname.firstname} ${captain.fullname.lastname}`
          }
        });
        sentToCount++;
      }
    }

    console.log(`Sent ride requests to ${sentToCount} captains`);
    res.status(201).json({ 
      ...ride.toObject(),
      sentTo: sentToCount,
      message: `Ride request sent to ${sentToCount} captains`
    });

  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.getFare = async (req, res) => {
  try {
    const { pickUp, dest } = req.query;
    
    // Get coordinates for pickup location
    const pickupCoordinates = await mapService.getAddressCoordinates(pickUp);
    if (!pickupCoordinates) {
      return res.status(400).json({ message: "Invalid pickup location" });
    }

    // Get coordinates for destination
    const destCoordinates = await mapService.getAddressCoordinates(dest);
    if (!destCoordinates) {
      return res.status(400).json({ message: "Invalid destination location" });
    }

    // Calculate distance using the coordinates
    const distance = await mapService.calculateDistance(
      pickupCoordinates,
      destCoordinates
    );

    if (!distance) {
      return res.status(400).json({ message: "Could not calculate distance" });
    }

    // Base rates for different vehicle types (in rupees per km)
    const rates = {
      car: 12,
      bike: 6,
      auto: 8
    };

    // Calculate fares for all vehicle types
    const fares = {};
    for (const [type, rate] of Object.entries(rates)) {
      // Base fare + (rate per km * distance in km)
      const baseFare = 30;
      fares[type] = {
        fare: Math.round(baseFare + (rate * distance)),
        distance: parseFloat(distance.toFixed(1))
      };
    }

    // Find nearby captains with valid socket IDs
    const { ltd: lat, lng } = pickupCoordinates;
    const radiusInMeters = 5000; // 5 kilometer radius

    const availableCaptains = {};
    for (const vehicleType of Object.keys(rates)) {
      const captains = await findAvailableCaptains(lng, lat, radiusInMeters, vehicleType);
      availableCaptains[vehicleType] = captains.length;
    }

    res.status(200).json({
      ...fares,
      availableCaptains,
      pickup: pickupCoordinates,
      destination: destCoordinates
    });
  } catch (error) {
    console.error("Error calculating fare:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
