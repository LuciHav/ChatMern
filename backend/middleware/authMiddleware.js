import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/userModel.js';
export const protectRoute = async (req, res, next) => {
    try {
         const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    const user = await User.findById(decoded.id).select('-password'); // Exclude password from user data
        if (!user) {
            return res.status(404).json({ message: "Unauthorized: User not found" });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}