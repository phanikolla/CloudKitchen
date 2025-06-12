import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { Product } from '../models/Product';

describe('Product Endpoints', () => {
  const testProduct = {
    name: 'Test Product',
    description: 'Test Description',
    price: 9.99,
    category: 'Test Category',
    image: 'test.jpg'
  };

  let productId: Types.ObjectId;

  afterEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products', () => {
    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all products', async () => {
      await Product.create([
        testProduct,
        {
          name: 'Another Product',
          description: 'Another Description',
          price: 19.99,
          category: 'Another Category',
          image: 'another.jpg'
        }
      ]);

      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      const names = response.body.map((item: any) => item.name);
      expect(names).toContain(testProduct.name);
      expect(names).toContain('Another Product');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(testProduct);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testProduct.name);
      expect(response.body.price).toBe(testProduct.price);
      expect(response.body._id).toBeDefined();

      productId = new Types.ObjectId(response.body._id);
    });

    it('should return 400 for invalid product data', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Invalid Product' }); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return 400 for invalid price', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          ...testProduct,
          price: -10 // Invalid negative price
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Price must be a positive number');
    });
  });

  describe('GET /api/products/:id', () => {
    beforeEach(async () => {
      const product = await Product.create(testProduct);
      productId = product._id;
    });

    it('should return product by id', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testProduct.name);
      expect(response.body._id).toBe(productId.toString());
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/507f1f77bcf86cd799439011'); // Random MongoDB ID

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    beforeEach(async () => {
      const product = await Product.create(testProduct);
      productId = product._id;
    });

    it('should update product', async () => {
      const updatedData = {
        ...testProduct,
        name: 'Updated Product',
        price: 15.99
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Product');
      expect(response.body.price).toBe(15.99);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/507f1f77bcf86cd799439011')
        .send(testProduct);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: 'Invalid Update' }); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('DELETE /api/products/:id', () => {
    beforeEach(async () => {
      const product = await Product.create(testProduct);
      productId = product._id;
    });

    it('should delete product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product deleted successfully');

      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });
}); 