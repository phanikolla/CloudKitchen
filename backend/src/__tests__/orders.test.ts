import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import jwt from 'jsonwebtoken';

describe('Order Processing Tests', () => {
  let userToken: string;
  let testUser: any;
  let testProduct: any;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });

    // Create test product
    testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 9.99,
      category: 'Test Category',
      image: 'test.jpg'
    });

    // Generate token
    userToken = jwt.sign(
      { userId: testUser._id },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const orderData = {
        items: [{
          product: testProduct._id,
          quantity: 2,
          price: testProduct.price
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'USA'
        }
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(201);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.status).toBe('pending');
    });

    it('should not create order with invalid product', async () => {
      const orderData = {
        items: [{
          product: 'invalid-product-id',
          quantity: 2,
          price: 9.99
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'USA'
        }
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });

    it('should not create order with missing required fields', async () => {
      const orderData = {
        items: [{
          product: testProduct._id,
          quantity: 2
          // Missing price
        }],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
          // Missing country
        }
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      await Order.create([
        {
          user: testUser._id,
          items: [{
            product: testProduct._id,
            quantity: 2,
            price: testProduct.price
          }],
          status: 'pending',
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'USA'
          }
        },
        {
          user: testUser._id,
          items: [{
            product: testProduct._id,
            quantity: 1,
            price: testProduct.price
          }],
          status: 'delivered',
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'USA'
          }
        }
      ]);
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/api/orders')
        .query({ status: 'pending' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('pending');
    });
  });

  describe('GET /api/orders/:id', () => {
    let orderId: string;

    beforeEach(async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{
          product: testProduct._id,
          quantity: 2,
          price: testProduct.price
        }],
        status: 'pending',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'USA'
        }
      });
      orderId = order._id.toString();
    });

    it('should get order details', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id.toString()).toBe(orderId);
    });

    it('should not get order details without authentication', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    let orderId: string;

    beforeEach(async () => {
      const order = await Order.create({
        user: testUser._id,
        items: [{
          product: testProduct._id,
          quantity: 2,
          price: testProduct.price
        }],
        status: 'pending',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'USA'
        }
      });
      orderId = order._id.toString();
    });

    it('should update order status', async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'processing' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('processing');
    });

    it('should not update order with invalid status', async () => {
      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBeDefined();
    });
  });
}); 