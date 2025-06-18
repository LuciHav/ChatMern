// controllers/userController.js

import User from "../models/userModel.js";
import Joi from "joi";
import bcrypt from 'bcrypt';

import { generateToken } from "../lib/utils.js";

// 1. Define Joi schema
const userValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profilePicture: Joi.string().uri().optional(),
});


export const signup = async (req, res) => {
  // Validate the request body
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashpass,
      profilePicture:
        req.body.profilePicture ||
        "https://example.com/default-profile-picture.png",
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token and set cookie
    const token = generateToken(newUser._id, res);

    // Send response with user data (excluding password) and token
    const { password, ...userWithoutPassword } = newUser._doc;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token, // Include token in response body (optional)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const userloginvalidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const login = async (req, res) => {
  // Validate input
  const { error } = userloginvalidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPassCorrect = await bcrypt.compare(req.body.password, existingUser.password);
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token and set cookie or return token
    generateToken(existingUser._id, res);

    // Send success response without password
    const { password, ...userWithoutPassword } = existingUser.toObject();

    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const logout = (req, res) => {
  // Handle user logout logic here
try {
    res.clearCookie("jwt"); // Clear the JWT cookie
    res.status(200).json({ message: "Logout successful" });
  }
  catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
