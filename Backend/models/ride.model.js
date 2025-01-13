const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickUp: {
        type: String,
        required: true,
    },
    dest: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['car', 'bike', 'auto'],
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending',
    },
    duration: {
        type: Number,
    },
    distance: {
        type: Number,
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp: {
        type: String,
        default: () => Math.floor(1000 + Math.random() * 9000).toString(),
        select: false,
    }
});

module.exports = mongoose.model('ride', rideSchema);
