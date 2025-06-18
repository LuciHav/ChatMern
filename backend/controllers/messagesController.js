import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";

import Joi from "joi";
import { generateToken } from "../lib/utils.js";


export const getusers = async (req, res) => {
    try {
    
        const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request object
        const filterdUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password -__v"); // Exclude password and __v field from the response
         res.status(200).json({
            message: "Users fetched successfully",
            users: filterdUsers,  
         });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        
    }


}


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // The user you're chatting with
    const senderId = req.user._id;           // The logged-in user's ID

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId }
      ]
    })

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json({
      message: "Messages fetched successfully",
      messages
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Joi validation: allow either text or image
const messageValidationSchema = Joi.object({
    receiverId: Joi.string().required(),
    text: Joi.string().allow("", null),
    image: Joi.string().allow("", null)
}).custom((value, helpers) => {
    if (!value.text && !value.image) {
        return helpers.message("Either text or image is required.");
    }
    return value;
});

export const sendMessage = async (req, res) => {
    const receiverId = req.params.id;

    if (!receiverId) {
        return res.status(400).json({ message: "Receiver ID is required" });
    }

    const { text, image } = req.body;
    const senderId = req.user._id;

    try {
        // Validate input
        const { error } = messageValidationSchema.validate({ receiverId, text, image });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        let imageUrl = null;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            imageUrl
        });

        await newMessage.save();

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: "No message found" });
    }

    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
