const request = require('supertest');
const app = require('../app');
require('./setup');

let adminToken;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Admin', email: 'admin@example.com', password: 'adminpass', role: 'admin'
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com', password: 'adminpass'
  });
  adminToken = res.body.token;
});

describe('Settings API', () => {
  it('should update file limits', async () => {
    const res = await request(app)
      .patch('/api/settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ maxFileSizeMB: 20 });
    expect(res.statusCode).toBe(200);
    expect(res.body.settings.maxFileSizeMB).toBe(20);
  });
});
