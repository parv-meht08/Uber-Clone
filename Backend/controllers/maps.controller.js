const mapsService = require('../services/maps.service');
const { validationResult } = require('express-validator');

// Export the controller with the expected structure
exports.mapController = {
    getAddressCoordinates: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { address } = req.body;
        try {
            const coordinates = await mapsService.getAddressCoordinates(address);
            res.status(200).json({ coordinates });
        } catch (error) {        
            res.status(404).json({ message: 'Coordinates not found' });
        }
    }
};