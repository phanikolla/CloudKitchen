import express from 'express';
import Stripe from 'stripe';
import { Order } from '../models/Order';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'your-stripe-secret-key', {
  apiVersion: '2023-10-16'
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate total amount in cents
    const totalAmount = Math.round(order.items.reduce((total, item) => {
      const itemPrice = typeof item.price === 'number' ? item.price : 0;
      return total + (itemPrice * item.quantity);
    }, 0) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      metadata: {
        orderId: order._id.toString()
      }
    });

    return res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating payment intent', error });
  }
});

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    order.status = 'processing';
    await order.save();

    return res.json({ message: 'Payment confirmed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error confirming payment', error });
  }
});

// Get payment status
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ status: order.status });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching payment status', error });
  }
});

export default router; 