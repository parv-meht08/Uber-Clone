const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const captionSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
    },
    vehicle: {
        color: { type: String },
        plate: { type: String },
        capacity: { type: Number },
        vehicleType: { type: String },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, default: "inactive" },
    role: { type: String, default: "caption" }, // Add this field
});

module.exports = mongoose.model("Caption", captionSchema);


captionSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    return token;
};

captionSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(password, this.password);
};

captionSchema.methods.hashPassword = function(password) {
    return bcrypt.hashSync(password, 10);
};

const captionModel = mongoose.model("caption", captionSchema);

module.exports = captionModel;