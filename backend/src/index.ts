import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Connect to MongoDB and start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spice-story';
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

  app.get('/', (_req, res) => {
    res.send('Spice Story API is running');
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { app }; 