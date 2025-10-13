# scoreboard2

Express.js and Knex.js REST API with user authentication and authorization.

## Features

- ✅ User registration and authentication
- ✅ JWT-based token authentication
- ✅ Role-based access control (Admin/User)
- ✅ SQLite database with Knex.js ORM
- ✅ Comprehensive test suite (12 tests passing)
- ✅ Password hashing with bcrypt
- ✅ API endpoints for user management

## Quick Start

```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

Server runs on http://localhost:3000

## API Endpoints

- `POST /api/signup` - Create new user account
- `POST /api/login` - Login and get JWT token
- `POST /api/logout` - Logout (requires auth)
- `GET /api/users` - List all users (admin only)

## Default Users

- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `john`, password: `user123`
- **User**: username: `jane`, password: `user123`

## Testing

```bash
cd backend
npm test
```

All 12 tests passing ✓

## Documentation

- See [backend/README.md](backend/README.md) for detailed API documentation
- See [SETUP_SUMMARY.md](SETUP_SUMMARY.md) for setup details