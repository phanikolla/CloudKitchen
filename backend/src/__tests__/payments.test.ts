import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import jwt from 'jsonwebtoken';

describe('Payment Processing Tests', () => {
  let userToken: string;
  let testUser: any;
  let testOrder: any;

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    });

    // Create test product
    const testProduct = await Product.create({
      name: 'Test Product',
      description: 'Test Description',
      price: 9.99,
      category: 'Test Category',
      image: 'test.jpg'
    });

    // Create test order
    testOrder = await Order.create({
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

  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent for order', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ orderId: testOrder._id });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('clientSecret');
    });

    it('should not create payment intent for non-existent order', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ orderId: 'invalid-order-id' });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/payments/confirm', () => {
    it('should confirm payment and update order status', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          orderId: testOrder._id,
          paymentIntentId: 'test_payment_intent'
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('processing');
    });

    it('should not confirm payment for non-existent order', async () => {
      const response = await request(app)
        .post('/api/payments/confirm')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          orderId: 'invalid-order-id',
          paymentIntentId: 'test_payment_intent'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/payments/status/:orderId', () => {
    it('should get payment status for order', async () => {
      const response = await request(app)
        .get(`/api/payments/status/${testOrder._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });

    it('should not get payment status for non-existent order', async () => {
      const response = await request(app)
        .get('/api/payments/status/invalid-order-id')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(404);
    });
  });
}); 