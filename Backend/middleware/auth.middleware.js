const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ message: "Unauthorized access!" });
  }

  const isBlacklisted = await userModel.findOne({ token });

  if(isBlacklisted){
    res.status(401).json({ message: "Token blacklisted, please log in again!" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);  // Log decoded token for debugging

      const user = await userModel.findById(decoded.id);
      if (!user) {
          return res.status(401).json({ message: "User not found!" });
      }

      req.user = user;  // Attach user data to request
      next();
  } catch (err) {
      if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: "Token expired, please log in again!" });
      }

      console.error("JWT Verification Error:", err);  // Log error details
      return res.status(401).json({ message: "Invalid token!" });
  }
};
