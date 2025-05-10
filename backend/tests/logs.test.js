const request = require('supertest');
const app = require('../app');
require('./setup');

describe('Logs API', () => {
  let adminToken;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'LoggerAdmin', email: 'loggeradmin@example.com', password: 'admin123', role: 'admin'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'loggeradmin@example.com', password: 'admin123'
    });
    adminToken = res.body.token;
  });

  it('should fetch logs', async () => {
    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
