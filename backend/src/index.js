import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import { connectDB } from '../lib/db.js';
import messsagesRoutes from './routes/messages.js';
import '../lib/cloudinary.js'; 
import cors from 'cors';


const app = express();

// ✅ Middlewares (order matters!)
app.use(express.json());         // Parse JSON request bodies
app.use(cookieParser());         // Parse cookies (needed before route access)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow frontend URL
  credentials: true, // Allow cookies
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messsagesRoutes);

// ✅ Server start
const port = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to DB:', err.message);
    process.exit(1);
  }
}

startServer();
