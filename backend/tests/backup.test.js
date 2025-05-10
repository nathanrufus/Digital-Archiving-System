const request = require('supertest');
const app = require('../app');
const fs = require('fs');
require('./setup');

let adminToken;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'BackupAdmin', email: 'backupadmin@example.com', password: 'admin456', role: 'admin'
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'backupadmin@example.com', password: 'admin456'
  });
  adminToken = res.body.token;
});

describe('Backup API', () => {
  it('should create a backup archive', async () => {
    const res = await request(app)
      .post('/api/backup')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200); 
  });
});
