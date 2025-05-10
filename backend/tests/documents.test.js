const request = require('supertest');
const app = require('../app');
const path = require('path');
require('./setup');

let token;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Uploader', email: 'uploader@example.com', password: '123456', role: 'general'
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'uploader@example.com', password: '123456'
  });
  token = res.body.token;
});

describe('Document APIs', () => {
  it('should upload a document', async () => {
    const res = await request(app)
      .post('/api/documents/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', path.join(__dirname, 'sample.pdf'))
      .field('tags', 'invoice,finance')
      .field('description', 'Q2 invoice');

    expect(res.statusCode).toBe(201);
    expect(res.body.document.name).toBeDefined();
  });

  it('should list uploaded documents', async () => {
    const res = await request(app)
      .get('/api/documents')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
