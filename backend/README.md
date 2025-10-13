# Backend API

Express.js and Knex.js REST API with user authentication.

## Features

- User registration (signup)
- User login with JWT authentication
- User logout
- List all users (admin only)
- SQLite database with Knex.js migrations and seeds

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Run database migrations:
```bash
npm run migrate
```

4. Seed the database with initial users:
```bash
npm run seed
```

## Initial Users

The database is seeded with the following users:

- **Admin User**
  - Username: `admin`
  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: Admin

- **Regular Users**
  - Username: `john`, Email: `john@example.com`, Password: `user123`
  - Username: `jane`, Email: `jane@example.com`, Password: `user123`

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Public Endpoints

#### POST /api/signup
Create a new user account.

**Request:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 4,
    "username": "newuser",
    "email": "newuser@example.com",
    "is_admin": false,
    "created_at": "2025-10-13T07:52:15.000Z",
    "updated_at": "2025-10-13T07:52:15.000Z"
  }
}
```

#### POST /api/login
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "is_admin": true,
    "created_at": "2025-10-13T07:52:15.000Z",
    "updated_at": "2025-10-13T07:52:15.000Z"
  }
}
```

### Protected Endpoints

All protected endpoints require an `Authorization` header with the format: `Bearer <token>`

#### POST /api/logout
Logout the current user.

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

### Admin-Only Endpoints

#### GET /api/users
List all users (requires admin privileges).

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "is_admin": true,
      "created_at": "2025-10-13T07:52:15.000Z",
      "updated_at": "2025-10-13T07:52:15.000Z"
    },
    ...
  ]
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Database Commands

Run migrations:
```bash
npm run migrate
```

Rollback migrations:
```bash
npm run migrate:rollback
```

Run seeds:
```bash
npm run seed
```

## Project Structure

```
backend/
├── db/
│   ├── migrations/       # Database migrations
│   └── seeds/           # Database seeds
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── app.js          # Express app setup
├── tests/              # Test files
├── knexfile.js        # Knex configuration
├── server.js          # Server entry point
└── package.json
```
