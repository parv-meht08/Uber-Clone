const axios = require("axios");
const mapsService = require("../services/maps.service");
const { validationResult } = require("express-validator");

module.exports.mapController = {
    getAddressCoordinates: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { address } = req.query;
        try {
            const coordinates = await mapsService.getAddressCoordinates(address);
            res.status(200).json({ coordinates });
        } catch (error) {
            res.status(404).json({ message: "Coordinates not found" });
        }
    },

    getDistanceTime: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;
        try {
            const distanceTime = await mapsService.getDistanceTime(origin, destination);
            res.status(200).json({ distanceTime });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getAutoCompleteSuggestions: async (req, res) => {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Query is required" });
        }

        const apiKey = process.env.GOOGLE_MAPS_API;
        if (!apiKey) {
            return res.status(500).json({ message: "Google Maps API key is not configured" });
        }

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            if (response.data.status === "OK") {
                res.status(200).json({ suggestions: response.data.predictions });
            } else {
                res.status(400).json({ message: "Unable to fetch autocomplete suggestions" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
