# scoreboard2

Full-stack user management system with Express.js REST API backend and Vue 3 frontend.

## Features

### Backend
- ✅ User registration and authentication
- ✅ JWT-based token authentication
- ✅ Role-based access control (Admin/User)
- ✅ SQLite database with Knex.js ORM
- ✅ Comprehensive test suite (12 tests passing)
- ✅ Password hashing with bcrypt
- ✅ API endpoints for user management

### Frontend
- ✅ Vue 3 with Vue Router
- ✅ Bootstrap 5 modern UI
- ✅ Login and Signup screens with error handling
- ✅ Admin dashboard for user management
- ✅ JWT token storage in localStorage
- ✅ Unit tests (14 tests passing)

## Quick Start

### Backend

```bash
cd backend
npm install
npm run migrate
npm run seed
npm start
```

Server runs on http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run serve
```

Frontend runs on http://localhost:8080

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

### Backend Tests
```bash
cd backend
npm test
```

All 12 tests passing ✓

### Frontend Tests
```bash
cd frontend
npm run test:unit
```

All 14 tests passing ✓

## Documentation

- See [backend/README.md](backend/README.md) for detailed backend API documentation
- See [frontend/README.md](frontend/README.md) for frontend setup and usage
- See [SETUP_SUMMARY.md](SETUP_SUMMARY.md) for setup details

## Screenshots

### Home Page
![Home Page](https://github.com/user-attachments/assets/336bdf88-08ee-4d82-8ad1-6c16ce2d3843)

### Login
![Login Page](https://github.com/user-attachments/assets/3d7e6523-91df-4b9d-82e9-d5841ce44ed3)

### Signup
![Signup Page](https://github.com/user-attachments/assets/513f8870-67ab-48f7-8f7a-56b75c5b5f15)

### Admin Dashboard
![Admin Dashboard](https://github.com/user-attachments/assets/9229719b-4129-44d5-8032-cbaaa0de0cad)