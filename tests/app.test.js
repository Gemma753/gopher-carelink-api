const request = require('supertest');
const app = require('../src/app');

describe('Gopher CareLink Residents API', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /residents returns list', async () => {
    const res = await request(app).get('/residents');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /residents/:id returns single resident', async () => {
    const res = await request(app).get('/residents/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'Margaret Thompson');
  });

  it('POST /residents creates a new resident', async () => {
    const res = await request(app)
      .post('/residents')
      .send({ name: 'Test Resident', room: '200A', age: 70 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Resident');
  });
});
