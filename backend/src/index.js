import express from 'express';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import { connectDB } from '../lib/db.js';

const app = express();

app.use(express.json()); // JSON body parser middleware
app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

startServer();
