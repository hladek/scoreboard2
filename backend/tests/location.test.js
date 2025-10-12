const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let adminToken;
let userToken;

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();

  const adminLogin = await request(app)
    .post('/api/login')
    .send({ username: 'admin', password: 'password' });
  adminToken = adminLogin.body.token;

  const userLogin = await request(app)
    .post('/api/login')
    .send({ username: 'judge1', password: 'password' });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await db.destroy();
});

describe('Location API', () => {
  let newLocationId;

  it('should create a new location with valid data and token', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Location',
        date: '2025-10-12T12:00:00.000Z',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('location');
    expect(response.body.location.name).toBe('Test Location');
    newLocationId = response.body.location.id;
  });

  it('should not create a new location with invalid data', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Location' });

    expect(response.status).toBe(400);
  });

  it('should not create a new location without a token', async () => {
    const response = await request(app)
      .post('/api/locations')
      .send({
        name: 'Test Location',
        date: '2025-10-12T12:00:00.000Z',
      });

    expect(response.status).toBe(401);
  });

  it('should get a list of all locations', async () => {
    const response = await request(app).get('/api/locations');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('locations');
    expect(response.body.locations.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a single location by id', async () => {
    const response = await request(app).get(`/api/locations/${newLocationId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('location');
    expect(response.body.location.id).toBe(newLocationId);
  });

  it('should update a location with valid data and token', async () => {
    const response = await request(app)
      .put(`/api/locations/${newLocationId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Test Location' });

    expect(response.status).toBe(200);
    expect(response.body.location.name).toBe('Updated Test Location');
  });

  it('should not update a location without a token', async () => {
    const response = await request(app)
      .put(`/api/locations/${newLocationId}`)
      .send({ name: 'Updated Test Location' });

    expect(response.status).toBe(401);
  });
});
