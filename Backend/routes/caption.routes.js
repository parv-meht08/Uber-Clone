const captionController = require("../controllers/caption.controller");
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require('../middleware/auth.middleware')

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("fullname", "firstname")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid Type of Vehicle'),
  ],
   captionController.registerCaption
);

router.post('/login', [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
   .isLength({ min: 6 })
   .withMessage("Password must be at least 6 characters long"),
],
  captionController.loginCaption
)

router.get('/profile', authMiddleware.authCaption, captionController.getCaptionProfile)

router.get('/logout', authMiddleware.authCaption, captionController.logoutCaption)

module.exports = router;
