import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import tripRoutes from "./routes/tripRoutes.js"

// Load environment variables from .env
dotenv.config();

// Create an express app instance
const app = express();

// Enable cors
const allowedOrigins = ['https://plan-it-nu-six.vercel.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Even for JWT, needed to allow `Authorization` header
}));

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Authentication Routes
app.use('/api/auth', authRoutes);

// Routes
app.use('/api/trips', tripRoutes);

// Root route, can be used for testing if the server is up
app.get('/', (req, res) => res.status(200).json({
    message: "Response from Planit Server..!",
    path: "/"
}));

// Port for the server to run from
const PORT = process.env.PORT || 5000;
// Connect to DB and then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});