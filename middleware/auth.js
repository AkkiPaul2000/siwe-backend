const jwt = require('jsonwebtoken');

// JWT validation middleware
const verifySession = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload (walletAddress) to request object
        next();
    } catch (err) {
        console.error('Invalid or expired token:', err);
        res.status(401).json({ message: 'Invalid or expired session' });
    }
};

module.exports = { verifySession };
