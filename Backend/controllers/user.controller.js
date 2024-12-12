const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");
const userService = require("../services/user.service");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(400).json({ errors: 'User with this email already exists' });
    }

    try {
        const hashedPassword = await userModel.hashPassword(password);
        const user = new userModel({
            fullname,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = user.generateAuthToken();

        res.status(201).json({ token, user });
    } catch (error) {
        next(error);
    }
};

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);  // Send token in cookie
    res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({ user: req.user });
};

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    console.log('Extracted Token:', token);

    await blacklistTokenModel.create({ token });

    res.status(200).json({ message: "User logged out" });
};