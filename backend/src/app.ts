import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ message: 'Spice Story API is running' });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export { app }; 