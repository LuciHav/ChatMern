import mongoose from "mongoose";

import 'dotenv/config'



export const connectDB = async () => {
  try {
   
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the app with error
  }
};
