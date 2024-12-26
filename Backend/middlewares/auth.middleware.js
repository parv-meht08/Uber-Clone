const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const blacklistToken = require("../models/blacklistToken.model");
// const captionModel = require("../models/caption.model");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log("Token not provided!"); // Debugging
        return res.status(401).json({ message: "Unauthorized access!" });
    }

    const isBlacklisted = await blacklistToken.findOne({ token });

    if (isBlacklisted) {
        console.log("Token is blacklisted:", token); // Debugging
        return res.status(401).json({ message: "Token blacklisted, please log in again!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token (authUser):", decoded); // Debugging

        const user = await userModel.findById(decoded.id);
        if (!user) {
            console.log("User not found with ID:", decoded.id); // Debugging
            return res.status(401).json({ message: "User not found!" });
        }

        req.user = user; // Attach user data to request
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            console.log("Token expired:", err); // Debugging
            return res.status(401).json({ message: "Token expired, please log in again!" });
        }

        console.error("JWT Verification Error (authUser):", err); // Debugging
        return res.status(401).json({ message: "Invalid token!" });
    }
};

module.exports.authCaption = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }

  const isBlacklisted = await blacklistToken.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "Token blacklisted, please log in again!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const caption = await captionModel.findById(decoded._id);  // Make sure we use decoded._id

    if (!caption) {
      return res.status(401).json({ message: "Caption not found!" });
    }

    if (caption.role !== "caption") {
      return res.status(401).json({ message: "You are not authorized to access this resource!" });
    }

    req.user = caption;  // Attach caption to req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized Caption" });
  }
};



