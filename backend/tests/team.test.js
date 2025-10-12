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

describe('Team API', () => {
  let newTeamId;

  it('should create a new team with valid data and token', async () => {
    const response = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Team',
        affiliation: 'Test Affiliation',
        location_id: locationId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('team');
    expect(response.body.team.name).toBe('Test Team');
    newTeamId = response.body.team.id;
  });

  it('should not create a new team with invalid data', async () => {
    const response = await request(app)
      .post('/api/teams')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Team' });

    expect(response.status).toBe(400);
  });

  it('should not create a new team without a token', async () => {
    const response = await request(app)
      .post('/api/teams')
      .send({
        name: 'Test Team',
        affiliation: 'Test Affiliation',
        location_id: locationId,
      });

    expect(response.status).toBe(401);
  });

  it('should get a list of all teams', async () => {
    const response = await request(app).get('/api/teams');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('teams');
    expect(response.body.teams.length).toBeGreaterThanOrEqual(1);
  });

  it('should get a single team by id', async () => {
    const response = await request(app).get(`/api/teams/${newTeamId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('team');
    expect(response.body.team.id).toBe(newTeamId);
  });

  it('should update a team with valid data and token', async () => {
    const response = await request(app)
      .put(`/api/teams/${newTeamId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Test Team' });

    expect(response.status).toBe(200);
    expect(response.body.team.name).toBe('Updated Test Team');
  });

  it('should not update a team without a token', async () => {
    const response = await request(app)
      .put(`/api/teams/${newTeamId}`)
      .send({ name: 'Updated Test Team' });

    expect(response.status).toBe(401);
  });
});
