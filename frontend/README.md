# Scoreboard2 Frontend

Vue 3 frontend application for the Scoreboard2 user management system.

## Features

- **Bootstrap 5** - Modern, responsive UI
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **JWT Authentication** - Secure token-based auth stored in localStorage
- **Role-based Access** - Admin and regular user roles
- **Comprehensive Tests** - Unit tests with Jest and Vue Test Utils

## Components

- **Navbar** - Navigation with dynamic menu based on auth state
- **Login** - User authentication with error handling
- **Signup** - New user registration
- **UserList** - Display users (admin only)
- **UserEdit** - Edit user details (admin only)
- **AdminView** - Admin dashboard with user management

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to set the backend API URL:
   ```
   VUE_APP_API_BASE_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   npm run serve
   ```
   
   The app will be available at http://localhost:8080

4. **Build for production:**
   ```bash
   npm run build
   ```

## Testing

Run unit tests:
```bash
npm run test:unit
```

All 14 tests should pass:
- Login component (4 tests)
- Signup component (4 tests)
- UserList component (6 tests)

## Usage

### Public Access
- View home page
- Sign up for new account
- Login with credentials

### Admin Access
Login with admin credentials:
- Username: `admin`
- Password: `admin123`

Admin features:
- View all users
- Edit user details (UI only - backend update API not implemented yet)
- Add new users (UI only - backend create API not implemented yet)

### Regular User Access
Login with regular user credentials:
- Username: `john` or `jane`
- Password: `user123`

Regular users can:
- View their profile in navbar
- Logout

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # Vue components
│   │   ├── Login.vue       # Login form
│   │   ├── Signup.vue      # Signup form
│   │   ├── UserList.vue    # User list table
│   │   ├── UserEdit.vue    # User edit modal
│   │   └── Navbar.vue      # Navigation bar
│   ├── views/              # Route views
│   │   ├── Home.vue        # Home page
│   │   ├── LoginView.vue   # Login page
│   │   ├── SignupView.vue  # Signup page
│   │   └── AdminView.vue   # Admin dashboard
│   ├── router/
│   │   └── index.js        # Route definitions
│   ├── api.js              # API client
│   ├── App.vue             # Root component
│   └── main.js             # App entry point
├── tests/
│   └── unit/               # Unit tests
│       ├── Login.spec.js
│       ├── Signup.spec.js
│       └── UserList.spec.js
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── babel.config.js         # Babel configuration
├── jest.config.js          # Jest configuration
├── vue.config.js           # Vue CLI configuration
└── package.json            # Dependencies and scripts
```

## API Integration

The frontend communicates with the backend REST API:

- `POST /api/signup` - Create new user
- `POST /api/login` - Authenticate user
- `POST /api/logout` - Logout user
- `GET /api/users` - List all users (admin only)

JWT tokens are automatically included in requests via axios interceptors.

## Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token and user data
3. Token stored in localStorage
4. Token included in all API requests
5. Router guards protect admin routes
6. Navbar updates based on auth state

## Development

- **Linting:** `npm run lint`
- **Serve:** `npm run serve` (auto-reload on changes)
- **Build:** `npm run build`
- **Test:** `npm run test:unit`

## Notes

- User edit/add functionality is UI-only (backend endpoints not yet implemented)
- Admin access required to view user list
- Bootstrap 5 used for styling (no custom CSS needed)
