const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let adminToken;
let userToken;
let locationId;

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

  const locationResponse = await request(app)
    .post('/api/locations')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ name: 'Test Location', date: '2025-10-12T12:00:00.000Z' });
  locationId = locationResponse.body.location.id;
});

afterAll(async () => {
  await db.destroy();
});

describe('Contest API', () => {
  let newContestId;

  it('should create a new contest with valid data and token', async () => {
    const response = await request(app)
      .post('/api/contests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Contest',
        description: 'Test Description',
        max_rounds: 3,
        location_id: locationId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('contest');
    expect(response.body.contest.name).toBe('Test Contest');
    newContestId = response.body.contest.id;
  });

  it('should not create a new contest with invalid data', async () => {
    const response = await request(app)
      .post('/api/contests')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Contest' });

    expect(response.status).toBe(400);
  });

  it('should not create a new contest without a token', async () => {
    const response = await request(app)
      .post('/api/contests')
      .send({
        name: 'Test Contest',
        description: 'Test Description',
        max_rounds: 3,
        location_id: locationId,
      });

    expect(response.status).toBe(401);
  });

  it('should get a list of all contests', async () => {
    const response = await request(app).get('/api/contests');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('contests');
    expect(response.body.contests.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a single contest by id', async () => {
    const response = await request(app).get(`/api/contests/${newContestId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('contest');
    expect(response.body.contest.id).toBe(newContestId);
  });

  it('should update a contest with valid data and token', async () => {
    const response = await request(app)
      .put(`/api/contests/${newContestId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Test Contest' });

    expect(response.status).toBe(200);
    expect(response.body.contest.name).toBe('Updated Test Contest');
  });

  it('should not update a contest without a token', async () => {
    const response = await request(app)
      .put(`/api/contests/${newContestId}`)
      .send({ name: 'Updated Test Contest' });

    expect(response.status).toBe(401);
  });
});
