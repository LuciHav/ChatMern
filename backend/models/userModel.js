import mongoose from "mongoose";
import Joi from 'joi'; // ES Modules

 const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://example.com/default-profile-picture.png",
  },

 },
{timestamps: true});
const User = mongoose.model("User", userSchema);
export default User;