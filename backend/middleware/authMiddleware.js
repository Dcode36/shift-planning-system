import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify authentication
export const authMiddleware = async (req, res, next) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Middleware to check if the user is an Admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Forbidden: Admins only' });
    }
    next();
};

// Middleware to check if the user is an Employee
export const isEmployee = (req, res, next) => {
    if (!req.user || req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access Forbidden: Employees only' });
    }
    next();
};
