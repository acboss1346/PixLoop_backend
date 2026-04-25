import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: ['https://pixloop-nu.vercel.app', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads if not using Cloudinary entirely, but we are using Cloudinary.
// We'll keep this just in case.

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

import pool from './config/db.js';

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Server is running and Database is connected!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server running, but Database connection failed', error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
