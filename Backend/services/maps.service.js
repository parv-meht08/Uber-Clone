const axios = require("axios");
const captainModel = require("../models/captain.model");

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;

    // Add API key validation
    if (!apiKey) {
        throw new Error("Google Maps API key is not configured");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("Google Maps API Response:", {
            status: response.data.status,
            results: response.data.results?.length,
            error_message: response.data.error_message,
        });

        if (response.data.status === "OK" && response.data.results?.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng,
            };
        } else {
            throw new Error("Unable to fetch coordinates");
        }
    } catch (error) {
        console.error("Error in getAddressCoordinates:", error);
        throw new Error("Error occurred while fetching coordinates");
    }
};

module.exports.calculateDistance = async (origin, destination) => {
    const apiKey = process.env.GOOGLE_MAPS_API;

    if (!apiKey) {
        throw new Error("Google Maps API key is not configured");
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.ltd},${origin.lng}&destinations=${destination.ltd},${destination.lng}&key=${apiKey}`;
        
        const response = await axios.get(url);
        
        if (response.data.status === "OK" && response.data.rows[0]?.elements[0]?.status === "OK") {
            // Distance comes in meters, convert to kilometers
            const distanceInKm = response.data.rows[0].elements[0].distance.value / 1000;
            return distanceInKm;
        } else {
            throw new Error("Unable to calculate distance");
        }
    } catch (error) {
        console.error("Error calculating distance:", error);
        throw new Error("Error occurred while calculating distance");
    }
};

module.exports.getCaptainsInTheRadius = async (lng, ltd, radius) => {
    console.log(`Fetching captains with parameters: {
        lng: ${lng},
        ltd: ${ltd},
        radiusInRadians: ${radius / 6371}
    }`);

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[ltd, lng], radius / 6371],
            },
        },
        status: "active",
    });

    console.log("Found captains:", captains);
    return captains;
};

