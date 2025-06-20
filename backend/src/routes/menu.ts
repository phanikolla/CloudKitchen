import express from 'express';
import { MenuItem } from '../models/MenuItem';

const router = express.Router();

// Get all menu items
router.get('/', async (_req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });
    return res.json(menuItems);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching menu items', error });
  }
});

// Create a new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const menuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image
    });

    await menuItem.save();
    return res.status(201).json(menuItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating menu item', error });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    return res.json(menuItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching menu item', error });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate price is a positive number
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.json(menuItem);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating menu item', error });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    return res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting menu item', error });
  }
});

export default router; 