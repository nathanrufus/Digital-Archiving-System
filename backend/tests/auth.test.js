const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI); // use real test DB URI
  });
  
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth APIs', () => {
  let userToken;

  test('POST /api/auth/register - should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass1234',
        role: 'general',
        dob: '1990-01-01'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(/registered/i);
  });

  test('POST /api/auth/login - should login and return token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'pass1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    userToken = res.body.token;
  });
});
