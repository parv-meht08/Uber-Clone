const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const captionModel = require("../models/caption.model");
const captionService = require("../services/caption.service");
const BlacklistToken = require("../models/blacklistToken.model");

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

module.exports.loginCaption = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }
    const { email, password } = req.body;

    const caption = await captionModel.findOne({ email }).select('+password');

    if (!caption) {
        return res.status(400).json({ errors: "Caption does not exist" });
    }

    const isMatch = await bcrypt.compare(password, caption.password);

    if (!isMatch) {
        return res.status(400).json({ errors: "Invalid credentials" });
    }

    const token = caption.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({ caption, token });
};

module.exports.getCaptionProfile = async (req, res, next) => {
    const caption = await captionModel.findById(req.user._id).select("-password");

    if (!caption) { return res.status(404).json({ errors: "Caption not found" }); }

    res.status(200).json({ caption });
};

module.exports.logoutCaption = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.spilt(' ')[ 1 ];
    
    await BlacklistToken.create({ token });

    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
};
