import express from 'express';
import { Order } from '../models/Order';
import mongoose from 'mongoose';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const query: any = {};

    if (status && typeof status === 'string') {
      if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({ message: `Shipping address ${field} is required` });
      }
    }

    // Validate items
    for (const item of items) {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: 'Invalid product ID in items' });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ message: 'Invalid quantity in items' });
      }
      if (!item.price || item.price < 0) {
        return res.status(400).json({ message: 'Invalid price in items' });
      }
    }

    // Set user from auth middleware
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const newOrder = new Order({
      ...req.body,
      user: userId,
      status: 'pending'
    });

    await newOrder.save();
    return res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    return res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    if (!status || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    return res.status(500).json({ message: 'Error updating order status' });
  }
});

export default router; 