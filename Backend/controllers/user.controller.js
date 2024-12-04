const userModel = require("../models/user.model");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  try {
    // Hash the password using the static method on the user model
    const hashedPassword = await userModel.hashPassword(password);

    // Create a new user instance
    const user = new userModel({
      fullname,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate the auth token
    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};
