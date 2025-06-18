// controllers/userController.js

import User from "../models/userModel.js";
import Joi from "joi";
import bcrypt from 'bcrypt';
import 'dotenv/config';


import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// 1. Define Joi schema
const userValidationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  profilePicture: Joi.string().uri().optional(),
});
const userloginvalidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
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



export const updatecreds = async (req, res) => {
  try {
    const { profilePicture, fullName } = req.body;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!profilePicture && !fullName) {
      return res.status(400).json({
        message: "At least one field (profilePicture or fullName) is required",
      });
    }

    const updateData = {};

    if (fullName) {
      updateData.fullName = fullName;
    }

    if (profilePicture) {
      try {
        const uploadResult = await cloudinary.uploader.upload(profilePicture, {
          use_filename: true,
          unique_filename: false,
        });

        if (uploadResult?.secure_url) {
          updateData.profilePicture = uploadResult.secure_url;
        }
      } catch (uploadErr) {
        return res.status(500).json({
          message: "Failed to upload image to Cloudinary",
          error: uploadErr.message,
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User credentials updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const checkAuth = async (req, res) => { 
   try{res.status(200).json({
        message: "Protected route accessed successfully",
        user: req.user, // User data from middleware
    });} 
    catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });    
    }
}
