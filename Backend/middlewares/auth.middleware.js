const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
    if (!token) throw new Error('Token not provided');
    const isBlacklisted = await blackListTokenModel.findOne({ token });
    if (isBlacklisted) throw new Error('Token is blacklisted');
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        const decoded = await verifyToken(token);

        const user = await userModel.findById(decoded._id);
        if (!user) return res.status(401).json({ message: 'User not found. Please log in again.' });

        req.user = user;
        next();
    } catch (err) {
        console.error("User authentication failed:", err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        const decoded = await verifyToken(token);

        const captain = await captainModel.findById(decoded._id);
        if (!captain) return res.status(401).json({ message: 'Captain not found. Please log in again.' });

        req.captain = captain;
        next();
    } catch (err) {
        console.error("Captain authentication failed:", err.message);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
