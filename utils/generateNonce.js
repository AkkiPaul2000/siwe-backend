// utils/generateNonce.js
const crypto = require('crypto');

// Generates a random nonce
const createNonce = () => crypto.randomBytes(16).toString('hex');

module.exports = {
    createNonce
};