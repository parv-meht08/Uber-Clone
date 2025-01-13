const express = require('express');
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Create Ride
router.post(
    '/create',
    authMiddleware.authUser,
    body('pickUp').isString().isLength({ min: 3 }).withMessage('Pickup location invalid'),
    body('dest').isString().isLength({ min: 3 }).withMessage('Destination invalid'),
    body('vehicleType').isString().isIn(['auto', 'car', 'bike']).withMessage('Invalid vehicle type'),
    body('fare').isNumeric().withMessage('Fare must be a number'),
    rideController.createRide
);

// Get Fare
router.get(
    '/get-fare',
    authMiddleware.authUser,
    query('pickUp').isString().isLength({ min: 3 }).withMessage('Pickup location invalid'),
    query('dest').isString().isLength({ min: 3 }).withMessage('Destination invalid'),
    rideController.getFare
);

module.exports = router;
