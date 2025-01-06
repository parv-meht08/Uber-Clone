const axios = require("axios");

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
      error_message: response.data.error_message, // Added to show any API-provided error messages
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
    console.error(error);
    throw new Error("Error occurred while fetching coordinates");
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  // Add API key validation
  if (!apiKey) {
    throw new Error("Google Maps API key is not configured");
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "NOT_FOUND") {
        throw new Error("Unable to find origin or destination");
      }

      return response.data.rows[0].elements[0];
    } else {
      throw new Error("Unable to fetch distance and time");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
    if(!input){
        throw new Error("Query is required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    // Add API key validation
    if (!apiKey) {
        throw new Error("Google Maps API key is not configured");
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${input.origin}&destination=${input.destination}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            return response.data.routes[0];
        } else {
            throw new Error("Unable to fetch directions");
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}