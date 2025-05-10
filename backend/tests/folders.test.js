const request = require('supertest');
const app = require('../app');
require('./setup');

let userToken;

beforeAll(async () => {
  await request(app).post('/api/auth/register').send({
    name: 'FolderUser', email: 'folder@example.com', password: '123456', role: 'general'
  });
  const res = await request(app).post('/api/auth/login').send({
    email: 'folder@example.com', password: '123456'
  });
  userToken = res.body.token;
});

describe('Folder APIs', () => {
  let folderId;

  it('should create a folder', async () => {
    const res = await request(app)
      .post('/api/folders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Reports', category: 'Finance' });
    folderId = res.body.folder._id;
    expect(res.statusCode).toBe(201);
  });

  it('should rename a folder', async () => {
    const res = await request(app)
      .patch(`/api/folders/${folderId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'UpdatedReports' });
    expect(res.statusCode).toBe(200);
  });
});