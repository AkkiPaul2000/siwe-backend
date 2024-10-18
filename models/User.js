// models/User.js
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    nonce: {
        type: String,
        default: null, // Set default to null to allow empty nonce
    },
    sessionToken: {
        type: String,
    },
    lastLogin: {
        type: Date,
    },
});


const User = mongoose.model('User', userSchema);
module.exports = User;