const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let adminToken;
let userToken;
let newLocationId;
let newContestId;
let newTeamId;

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();

  const adminLogin = await request(app)
    .post('/api/login')
    .send({ username: 'admin', password: 'password' });
  adminToken = adminLogin.body.token;

  const userLogin = await request(app)
    .post('/api/login')
    .send({ username: 'judge1', password: 'password', });
  userToken = userLogin.body.token;
});

beforeEach(async () => {
  // Create a new location for each test
  const locationResponse = await request(app)
    .post('/api/locations')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Location for Contests/Teams',
      date: '2025-10-15T12:00:00.000Z',
    });
  newLocationId = locationResponse.body.location.id;

  // Create a contest for the new location
  const contestResponse = await request(app)
    .post('/api/contests')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Contest',
      location_id: newLocationId,
      description: 'A test contest description',
      max_rounds: 5,
      date: '2025-10-15T12:00:00.000Z',
      status: 'scheduled',
    });
  newContestId = contestResponse.body.contest.id;

  // Create a team for the new location
  const teamResponse = await request(app)
    .post('/api/teams')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Team',
      location_id: newLocationId,
      affiliation: 'Test Affiliation',
    });
  newTeamId = teamResponse.body.team.id;
});

afterAll(async () => {
  await db.destroy();
});

describe('Location API', () => {
  // newLocationId is now set in beforeEach

  it('should create a new location with valid data and token', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Another Test Location',
        date: '2025-10-12T12:00:00.000Z',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('location');
    expect(response.body.location.name).toBe('Another Test Location');
    // newLocationId is already set by beforeEach, so we don't reassign here
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

  it('should get contests by location id', async () => {
    const response = await request(app).get(`/api/locations/${newLocationId}/contests`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('contests');
    expect(response.body.contests.length).toBeGreaterThanOrEqual(1);
    expect(response.body.contests[0].location_id).toBe(newLocationId);
  });

  it('should get teams by location id', async () => {
    const response = await request(app).get(`/api/locations/${newLocationId}/teams`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('teams');
    expect(response.body.teams.length).toBeGreaterThanOrEqual(1);
    expect(response.body.teams[0].location_id).toBe(newLocationId);
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
