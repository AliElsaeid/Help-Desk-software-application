const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

function authenticationMiddleware(req, res, next) {
    // Get the token from the request headers or cookies
    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId; 
        next(); 
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = authenticationMiddleware;