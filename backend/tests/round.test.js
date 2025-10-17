const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

let adminToken;
let userToken;
let locationId;
let contestId;
let teamId;

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

  const contestResponse = await request(app)
    .post('/api/contests')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Contest',
      description: 'Test Description',
      max_rounds: 3,
      location_id: locationId,
    });
  contestId = contestResponse.body.contest.id;

  const teamResponse = await request(app)
    .post('/api/teams')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Team',
      affiliation: 'Test Affiliation',
      location_id: locationId,
    });
  teamId = teamResponse.body.team.id;
});

afterAll(async () => {
  await db.destroy();
});

describe('Round API', () => {
  let newRoundId;

  it('should create a new round with valid data and token', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        round_number: 1,
        contest_id: contestId,
        team_id: teamId,
        time: 120,
        points: 50,
	status: 'new',
        judge_notes: 'Good performance',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('round');
    expect(response.body.round.round_number).toBe(1);
    expect(response.body.round.time).toBe(120);
    expect(response.body.round.points).toBe(50);
    expect(response.body.round.judge_notes).toBe('Good performance');
    newRoundId = response.body.round.id;
  });

  it('should create a round with minimal required fields', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        round_number: 2,
	status: 'new',
        contest_id: contestId,
        team_id: teamId,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('round');
    expect(response.body.round.round_number).toBe(2);
  });

  it('should not create a round without round_number', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        contest_id: contestId,
        team_id: teamId,
        status: 'new',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not create a round without contest_id', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        round_number: 3,
        team_id: teamId,
        status: 'new',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not create a round without team_id', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        round_number: 3,
        contest_id: contestId,
        status: 'new',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should not create a round without a token', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .send({
        round_number: 1,
	status: 'new',
        contest_id: contestId,
        team_id: teamId,
      });

    expect(response.status).toBe(401);
  });

  it('should create a round with user token', async () => {
    const response = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        round_number: 3,
        contest_id: contestId,
        team_id: teamId,
	status: 'new',
        time: 90,
        points: 40,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('round');
  });

  it('should get a list of all rounds', async () => {
    const response = await request(app)
      .get('/api/rounds')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('rounds');
    expect(response.body.rounds.length).toBeGreaterThanOrEqual(3);
  });

  it('should get rounds filtered by contest_id', async () => {
    const response = await request(app)
      .get(`/api/rounds?contest_id=${contestId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('rounds');
    expect(response.body.rounds.length).toBeGreaterThanOrEqual(3);
    response.body.rounds.forEach(round => {
      expect(round.contest_id).toBe(contestId);
    });
  });

  it('should not get rounds without a token', async () => {
    const response = await request(app).get('/api/rounds');

    expect(response.status).toBe(401);
  });

  it('should update a round with valid data and token', async () => {
    const response = await request(app)
      .put(`/api/rounds/${newRoundId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        time: 150,
	status: 'new',
        points: 60,
        judge_notes: 'Updated notes',
      });

    expect(response.status).toBe(200);
    expect(response.body.round.time).toBe(150);
    expect(response.body.round.points).toBe(60);
    expect(response.body.round.judge_notes).toBe('Updated notes');
  });

  it('should update round with partial data', async () => {
    const response = await request(app)
      .put(`/api/rounds/${newRoundId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        points: 75,
      });

    expect(response.status).toBe(200);
    expect(response.body.round.points).toBe(75);
  });

  it('should not update a round without a token', async () => {
    const response = await request(app)
      .put(`/api/rounds/${newRoundId}`)
      .send({
        points: 80,
      });

    expect(response.status).toBe(401);
  });

  it('should update a round with user token', async () => {
    const response = await request(app)
      .put(`/api/rounds/${newRoundId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        judge_notes: 'Updated by judge',
      });

    expect(response.status).toBe(200);
    expect(response.body.round.judge_notes).toBe('Updated by judge');
  });
});
