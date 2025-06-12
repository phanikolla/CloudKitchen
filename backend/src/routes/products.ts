import express from 'express';
import { Product } from '../models/Product';

const router = express.Router();

// Get all products
router.get('/', async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Create new product
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

    const product = new Product({
      name,
      description,
      price,
      category,
      image
    });

    await product.save();
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Update product
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product', error });
  }
});

export default router; 