require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authController = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Routes (No session validation)
app.get('/nonce', authController.generateNonce); // Generate nonce for login
app.post('/login', authController.login); // Login with signature
app.post('/logout', authController.logout); // Logout

// Simplified protected route (No token required)
app.get('/protected', (req, res) => {
    res.status(200).json({
        message: 'Access granted',
        walletAddress: req.query.walletAddress, // Assume walletAddress sent as query param
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
