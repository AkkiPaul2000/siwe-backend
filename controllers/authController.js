const {
    ethers
} = require('ethers');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating JWT
const User = require('../models/User');
const {
    createNonce
} = require('../utils/generateNonce');

// JWT secret from environment variables (or use a hardcoded secret for dev)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Generate and return a nonce
const generateNonce = async(req, res) => {
    const {
        wallet
    } = req.query;

    try {
        let user = await User.findOne({
            walletAddress: wallet
        });

        // If user doesn't exist or nonce is null, create/generate a new nonce
        if (!user) {
            const nonce = createNonce();
            user = new User({
                walletAddress: wallet,
                nonce
            });
            await user.save();
        } else if (!user.nonce) {
            user.nonce = createNonce();
            await user.save();
        }

        // Send back the nonce (new or existing)
        res.status(200).json({
            nonce: user.nonce
        });
    } catch (error) {
        console.error('Error generating nonce:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Login with signature verification and JWT generation
const login = async(req, res) => {
    const {
        message,
        signature,
        walletAddress
    } = req.body;

    try {
        // Fetch the user from the database
        const user = await User.findOne({
            walletAddress
        });

        if (!user || !user.nonce) {
            return res.status(400).json({
                message: 'Nonce not found'
            });
        }

        // Verify the signature using ethers.js
        const expectedMessage = `${walletAddress} wants you to sign in:\nNonce: ${user.nonce}`;
        const recoveredAddress = ethers.utils.verifyMessage(expectedMessage, signature);

        if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(401).json({
                message: 'Invalid signature'
            });
        }

        // Clear the nonce to prevent reuse
        user.nonce = null;
        await user.save();

        // Generate a JWT token
        const token = jwt.sign({
            walletAddress
        }, JWT_SECRET, {
            expiresIn: '1h' // Token expires in 1 hour
        });

        // Send the token back to the frontend
        res.status(200).json({
            message: 'Login successful',
            token // Return the JWT token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error'
        });
    }
};

// Simplified logout
const logout = (req, res) => {
    res.status(200).json({
        message: 'Logged out successfully'
    });
};

module.exports = {
    generateNonce,
    login,
    logout
};