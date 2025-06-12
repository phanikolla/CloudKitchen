import request from 'supertest';
import { Types } from 'mongoose';
import { app } from '../app';
import { MenuItem } from '../models/MenuItem';

describe('Menu Endpoints', () => {
  const testMenuItem = {
    name: 'Test Item',
    description: 'Test Description',
    price: 9.99,
    category: 'Test Category',
    image: 'test.jpg'
  };

  let createdMenuItemId: Types.ObjectId;

  afterEach(async () => {
    await MenuItem.deleteMany({});
  });

  describe('GET /api/menu', () => {
    it('should return empty array when no menu items exist', async () => {
      const response = await request(app)
        .get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all menu items', async () => {
      await MenuItem.create([
        testMenuItem,
        {
          name: 'Another Item',
          description: 'Another Description',
          price: 19.99,
          category: 'Another Category',
          image: 'another.jpg'
        }
      ]);

      const response = await request(app)
        .get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      const names = response.body.map((item: any) => item.name);
      expect(names).toContain(testMenuItem.name);
      expect(names).toContain('Another Item');
    });
  });

  describe('POST /api/menu', () => {
    it('should create a new menu item', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send(testMenuItem);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testMenuItem.name);
      expect(response.body.price).toBe(testMenuItem.price);
      expect(response.body._id).toBeDefined();

      createdMenuItemId = new Types.ObjectId(response.body._id);
    });

    it('should return 400 for invalid menu item data', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({ name: 'Invalid Item' }); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    it('should return 400 for invalid price', async () => {
      const response = await request(app)
        .post('/api/menu')
        .send({
          ...testMenuItem,
          price: -10 // Invalid negative price
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Price must be a positive number');
    });
  });

  describe('GET /api/menu/:id', () => {
    beforeEach(async () => {
      const menuItem = await MenuItem.create(testMenuItem);
      createdMenuItemId = menuItem._id;
    });

    it('should return menu item by id', async () => {
      const response = await request(app)
        .get(`/api/menu/${createdMenuItemId}`);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(testMenuItem.name);
      expect(response.body._id).toBe(createdMenuItemId.toString());
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .get('/api/menu/507f1f77bcf86cd799439011'); // Random MongoDB ID

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Menu item not found');
    });
  });

  describe('PUT /api/menu/:id', () => {
    beforeEach(async () => {
      const menuItem = await MenuItem.create(testMenuItem);
      createdMenuItemId = menuItem._id;
    });

    it('should update menu item', async () => {
      const updatedData = {
        ...testMenuItem,
        name: 'Updated Item',
        price: 15.99
      };

      const response = await request(app)
        .put(`/api/menu/${createdMenuItemId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Item');
      expect(response.body.price).toBe(15.99);
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .put('/api/menu/507f1f77bcf86cd799439011')
        .send(testMenuItem);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should return 400 for invalid update data', async () => {
      const response = await request(app)
        .put(`/api/menu/${createdMenuItemId}`)
        .send({ name: 'Invalid Update' }); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });
  });

  describe('DELETE /api/menu/:id', () => {
    beforeEach(async () => {
      const menuItem = await MenuItem.create(testMenuItem);
      createdMenuItemId = menuItem._id;
    });

    it('should delete menu item', async () => {
      const response = await request(app)
        .delete(`/api/menu/${createdMenuItemId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Menu item deleted successfully');

      const deletedItem = await MenuItem.findById(createdMenuItemId);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .delete('/api/menu/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Menu item not found');
    });
  });
}); 