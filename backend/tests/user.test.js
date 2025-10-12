const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/database');

// Setup and teardown
beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();
  // Run seeds
  await db.seed.run();
});

afterAll(async () => {
  // Close database connection
  await db.destroy();
});

describe('User API', () => {
  let adminToken;
  let userToken;
  let newUserId;

  describe('POST /api/signup', () => {
    it('should create a new user', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'test123',
          affiliation: 'Test University'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.username).toBe('testuser');
      expect(response.body.user.affiliation).toBe('Test University');
      expect(response.body.user.status).toBe('new');
      expect(response.body.user.role).toBe('judge');
      expect(response.body.user).not.toHaveProperty('password');
      newUserId = response.body.user.id;
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser2'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 409 if username already exists', async () => {
      const response = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser',
          email: 'another@example.com',
          password: 'test123',
          affiliation: 'Some Other University'
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/login', () => {
    it('should login admin user and return token', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('admin');
      expect(response.body.user.role).toBe('admin');
      
      adminToken = response.body.token;
    });

    it('should login regular user and return token', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'judge1',
          password: 'password'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.username).toBe('judge1');
      
      userToken = response.body.token;
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });

    it('should return 400 if credentials are missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'admin'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a single user for admin', async () => {
      const response = await request(app)
        .get(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(newUserId);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/users/9999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user for admin', async () => {
      const response = await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'active',
          role: 'judge'
        });

      expect(response.status).toBe(200);
      expect(response.body.user.status).toBe('active');
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .put(`/api/users/${newUserId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          status: 'active'
        });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/logout', () => {
    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/logout')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/logout');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThanOrEqual(3);
      
      // Check that passwords are not included
      response.body.users.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
    });

    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(401);
    });
  });
});
