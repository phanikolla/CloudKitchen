import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not register user with existing email', async () => {
      await User.create(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should return 400 for invalid user data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Invalid User' }); // Missing required fields

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login existing user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.password).toBeUndefined();
    });

    it('should not login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 400 for invalid login data', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // Missing password

      expect(response.status).toBe(400);
    });
  });
}); 