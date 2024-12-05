const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const captionModel = require("../models/caption.model");
const captionService = require("../services/caption.service");

module.exports.registerCaption = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptionAlreadyExists = await captionModel.findOne({ email });

    if (isCaptionAlreadyExists) {
        return res.status(400).json({ errors: "Caption already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const caption = await captionService.createCaption({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email: email,
        password: hashPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType,
    });

    const token = caption.generateAuthToken();

    res.status(201).json({ caption, token });
};
