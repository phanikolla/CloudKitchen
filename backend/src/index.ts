import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Spice Story API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 