import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.STRIPE_SECRET_KEY = 'test-stripe-secret-key';

let mongoServer: MongoMemoryServer;

// Connect to the in-memory database before running tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clear all test data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Disconnect and stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Export the mongoose connection for use in tests
export const getMongooseConnection = () => mongoose.connection; 