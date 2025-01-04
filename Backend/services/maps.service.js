const axios = require('axios');

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    
    // Add API key validation
    if (!apiKey) {
        throw new Error('Google Maps API key is not configured');
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('Google Maps API Response:', {
            status: response.data.status,
            results: response.data.results?.length,
            error_message: response.data.error_message // Added to show any API-provided error messages
        });

        if (response.data.status === 'OK' && response.data.results?.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error occurred while fetching coordinates');
    }
}