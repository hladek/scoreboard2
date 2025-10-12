# Robotic Competition Scoreboard Application - Development Prompts

This document contains a series of prompts to guide the development of a robotic competition scoreboard application using Flask, SQLAlchemy, WebSockets, Bootstrap, and jQuery.

---

## Prompt 1: Complete Project Description

Create a complete project description for a Robotic Competition Scoreboard Application with the following requirements:

### Project Overview
- **Purpose**: Build a web-based scoreboard application for managing and displaying robotic competition results in real-time
- **Target Users**: Competition organizers, judges, teams, and spectators
- **Technology Stack**: 
  - Backend: Flask (Python web framework)
  - Database: SQLAlchemy (ORM)
  - Real-time Communication: WebSockets (Flask-SocketIO)
  - Frontend: Bootstrap 5 (CSS framework) and jQuery (JavaScript library)

### Functional Requirements

#### Competition Management
1. Create and manage multiple competitions/events
2. Register teams with team name, number, and contact information
3. Create match schedules with time slots
4. Define competition rounds (qualification, semifinals, finals)

#### Scoring System
1. Record scores for each match
2. Support multiple scoring criteria:
   - Points scored
   - Time penalties
   - Bonus points
   - Autonomous mode performance
3. Calculate rankings based on total points and tiebreakers
4. Track match history for each team

#### Real-time Display
1. Live scoreboard updates using WebSockets
2. Current match display with timer
3. Team rankings updated in real-time
4. Match schedule with current/upcoming matches
5. Match results history

#### User Interfaces
1. **Admin Panel**: 
   - Manage competitions, teams, and matches
   - Enter and edit scores
   - Control match flow (start, stop, reset)
   
2. **Scoreboard Display**:
   - Full-screen display mode for projectors
   - Live rankings table
   - Current match information
   - Next match preview
   
3. **Public View**:
   - View-only scoreboard for spectators
   - Team lookup and statistics
   - Match schedule viewer

#### API Requirements
1. RESTful API endpoints for all CRUD operations
2. WebSocket events for real-time updates
3. JSON response format
4. Proper HTTP status codes and error handling

### Technical Requirements

#### Database Schema
- Competitions table
- Teams table
- Matches table
- Scores table
- Users table (for admin authentication)

#### Security
- Admin authentication and authorization
- Session management
- Input validation and sanitization
- CSRF protection

#### Performance
- Efficient database queries with proper indexing
- Caching for frequently accessed data
- Optimized real-time updates
- Support for 50+ concurrent users

### Non-Functional Requirements
- Responsive design for mobile and desktop
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Accessibility standards (WCAG 2.1)
- Clean, intuitive user interface
- Comprehensive error handling
- Logging for debugging and audit trails

### Deliverables
1. Fully functional Flask application
2. Database schema with migrations
3. RESTful API documentation
4. Admin and public web interfaces
5. Real-time WebSocket implementation
6. Deployment configuration
7. User documentation

---

## Prompt 2: Minimal Flask Application Setup

Create a minimal Flask application structure for the robotic competition scoreboard with the following components:

### Project Structure
```
scoreboard2/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration settings
│   ├── models.py            # Database models (placeholder)
│   ├── routes.py            # Route handlers (placeholder)
│   ├── static/              # Static files
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── templates/           # Jinja2 templates
│       └── base.html        # Base template
├── requirements.txt         # Python dependencies
├── run.py                   # Application entry point
└── README.md               # Project documentation
```

### Application Factory Pattern
Create `app/__init__.py` with:
- Flask app initialization
- Configuration loading
- Extension initialization (SQLAlchemy, Flask-SocketIO, Flask-Login)
- Blueprint registration
- Error handlers

### Configuration
Create `app/config.py` with:
- Development, testing, and production configurations
- Database URI configuration
- Secret key for sessions
- WebSocket settings
- Other application settings

### Dependencies
Create `requirements.txt` with:
- Flask
- Flask-SQLAlchemy
- Flask-SocketIO
- Flask-Login
- Flask-WTF (for forms)
- python-dotenv (for environment variables)

### Entry Point
Create `run.py` that:
- Imports the create_app function
- Runs the Flask development server
- Configures SocketIO

### Base Template
Create `templates/base.html` with:
- Bootstrap 5 CSS and JS
- jQuery library
- Socket.IO client library
- Navigation bar structure
- Content block for child templates
- Footer

### Initial Routes
Create basic routes in `app/routes.py`:
- Home page route (`/`)
- About page route (`/about`)

The application should be runnable with `python run.py` and display a basic homepage.

---

## Prompt 3: Database Schema with SQLAlchemy

Create the complete database schema for the robotic competition scoreboard using SQLAlchemy ORM with the following models:

### Models to Create

#### 1. User Model (`app/models.py`)
```python
- id (Integer, Primary Key)
- username (String, Unique, Not Null)
- email (String, Unique, Not Null)
- password_hash (String, Not Null)
- role (String, choices: 'admin', 'judge', 'viewer')
- created_at (DateTime)
- Methods: set_password(), check_password()
```

#### 2. Competition Model
```python
- id (Integer, Primary Key)
- name (String, Not Null)
- description (Text)
- start_date (DateTime)
- end_date (DateTime)
- status (String, choices: 'upcoming', 'active', 'completed')
- created_at (DateTime)
- Relationship: teams, matches
```

#### 3. Team Model
```python
- id (Integer, Primary Key)
- competition_id (Foreign Key to Competition)
- team_number (Integer, Not Null)
- team_name (String, Not Null)
- school_name (String)
- contact_email (String)
- contact_phone (String)
- created_at (DateTime)
- Relationship: matches, scores
- Unique constraint: (competition_id, team_number)
```

#### 4. Match Model
```python
- id (Integer, Primary Key)
- competition_id (Foreign Key to Competition)
- match_number (Integer, Not Null)
- round_type (String, choices: 'qualification', 'semifinal', 'final')
- scheduled_time (DateTime)
- actual_start_time (DateTime, Nullable)
- actual_end_time (DateTime, Nullable)
- status (String, choices: 'scheduled', 'in_progress', 'completed', 'cancelled')
- field_number (Integer)
- created_at (DateTime)
- Relationship: scores, team_match_assignments
- Unique constraint: (competition_id, match_number)
```

#### 5. TeamMatchAssignment Model
```python
- id (Integer, Primary Key)
- match_id (Foreign Key to Match)
- team_id (Foreign Key to Team)
- alliance (String, choices: 'red', 'blue', 'solo')
- position (Integer, 1-3 for alliance matches)
- Unique constraint: (match_id, team_id)
```

#### 6. Score Model
```python
- id (Integer, Primary Key)
- match_id (Foreign Key to Match)
- team_id (Foreign Key to Team)
- autonomous_points (Integer, default=0)
- teleop_points (Integer, default=0)
- endgame_points (Integer, default=0)
- penalty_points (Integer, default=0)
- bonus_points (Integer, default=0)
- total_points (Integer, computed)
- ranking_points (Integer, default=0)
- notes (Text)
- created_at (DateTime)
- updated_at (DateTime)
- Unique constraint: (match_id, team_id)
```

### Additional Requirements
- Add database migration support using Flask-Migrate
- Create initialization script to set up tables
- Add sample data seeding function for testing
- Include proper indexing on foreign keys and frequently queried fields
- Add cascade delete rules where appropriate
- Implement computed properties for total scores and rankings
- Add __repr__ methods for all models for debugging

### Database Initialization
Create `migrations/` directory structure and initial migration files:
- Use `flask db init` to initialize migrations
- Create initial migration with `flask db migrate -m "Initial schema"`
- Provide instructions for applying migrations

---

## Prompt 4: REST API Implementation

Create a comprehensive REST API for the robotic competition scoreboard application with the following endpoints:

### API Structure

#### 1. Competition Endpoints (`/api/competitions`)
```
GET    /api/competitions              - List all competitions
GET    /api/competitions/<id>         - Get competition details
POST   /api/competitions              - Create new competition
PUT    /api/competitions/<id>         - Update competition
DELETE /api/competitions/<id>         - Delete competition
GET    /api/competitions/<id>/teams   - Get all teams in competition
GET    /api/competitions/<id>/matches - Get all matches in competition
GET    /api/competitions/<id>/rankings - Get team rankings
```

#### 2. Team Endpoints (`/api/teams`)
```
GET    /api/teams                     - List all teams
GET    /api/teams/<id>                - Get team details
POST   /api/teams                     - Create new team
PUT    /api/teams/<id>                - Update team
DELETE /api/teams/<id>                - Delete team
GET    /api/teams/<id>/matches        - Get team's match history
GET    /api/teams/<id>/scores         - Get team's score history
GET    /api/teams/<id>/stats          - Get team statistics
```

#### 3. Match Endpoints (`/api/matches`)
```
GET    /api/matches                   - List all matches
GET    /api/matches/<id>              - Get match details
POST   /api/matches                   - Create new match
PUT    /api/matches/<id>              - Update match
DELETE /api/matches/<id>              - Delete match
POST   /api/matches/<id>/start        - Start match (set in_progress)
POST   /api/matches/<id>/complete     - Complete match
GET    /api/matches/<id>/scores       - Get match scores
POST   /api/matches/<id>/teams        - Assign teams to match
```

#### 4. Score Endpoints (`/api/scores`)
```
GET    /api/scores                    - List all scores
GET    /api/scores/<id>               - Get score details
POST   /api/scores                    - Create new score
PUT    /api/scores/<id>               - Update score
DELETE /api/scores/<id>               - Delete score
```

#### 5. User/Auth Endpoints (`/api/auth`)
```
POST   /api/auth/login                - User login
POST   /api/auth/logout               - User logout
GET    /api/auth/current              - Get current user info
POST   /api/auth/register             - Register new user (admin only)
```

### Implementation Requirements

#### API Blueprint
- Create `app/api/__init__.py` for API blueprint
- Register blueprint with `/api` prefix
- Organize endpoints in separate modules:
  - `app/api/competitions.py`
  - `app/api/teams.py`
  - `app/api/matches.py`
  - `app/api/scores.py`
  - `app/api/auth.py`

#### Request/Response Format
- Accept JSON request bodies
- Return JSON responses
- Implement proper HTTP status codes:
  - 200 OK for successful GET/PUT
  - 201 Created for successful POST
  - 204 No Content for successful DELETE
  - 400 Bad Request for validation errors
  - 401 Unauthorized for auth failures
  - 403 Forbidden for permission issues
  - 404 Not Found for missing resources
  - 500 Internal Server Error for server errors

#### Error Handling
- Create error handler decorator
- Return consistent error JSON format:
  ```json
  {
    "error": "Error message",
    "status": 400,
    "details": {}
  }
  ```

#### Validation
- Validate request data using schemas
- Check required fields
- Validate data types and formats
- Validate foreign key relationships
- Return detailed validation error messages

#### Authentication & Authorization
- Require authentication for POST/PUT/DELETE operations
- Use Flask-Login for session management
- Implement role-based access control
- Allow GET operations without authentication for public data

#### Pagination
- Implement pagination for list endpoints
- Accept `page` and `per_page` query parameters
- Return pagination metadata in response:
  ```json
  {
    "items": [...],
    "page": 1,
    "per_page": 20,
    "total": 100,
    "pages": 5
  }
  ```

#### Filtering and Sorting
- Support filtering by query parameters
- Support sorting with `sort_by` and `order` parameters
- Examples:
  - `/api/teams?competition_id=1&sort_by=team_number`
  - `/api/matches?status=completed&round_type=final`

### WebSocket Events

#### Create SocketIO event handlers in `app/socketio_events.py`:

```python
# Client -> Server events
@socketio.on('connect')
@socketio.on('join_competition')
@socketio.on('leave_competition')

# Server -> Client events
emit('competition_update')    # Competition data changed
emit('match_started')          # Match started
emit('match_updated')          # Match in progress update
emit('match_completed')        # Match completed
emit('score_updated')          # Score changed
emit('rankings_updated')       # Rankings recalculated
```

#### Real-time Update Flow
- When scores are updated via API, emit WebSocket event
- Clients listening to competition room receive updates
- Update match status changes in real-time
- Broadcast ranking changes to all connected clients

---

## Prompt 5: Views Implementation with Bootstrap and jQuery

Create the web interface for the robotic competition scoreboard using Bootstrap 5 and jQuery:

### View Structure

#### 1. Base Template (`templates/base.html`)
- Responsive navigation bar with Bootstrap
- Include Bootstrap 5.3 CSS and JS
- Include jQuery 3.6+
- Include Socket.IO client library
- Common footer
- Flash message display area
- Content block for child templates

#### 2. Home Page (`templates/index.html`)
- Welcome message and application description
- List of active competitions with cards
- Quick links to create new competition (admin)
- Recent matches/activity feed
- Statistics overview (total competitions, teams, matches)

#### 3. Competition Pages

##### Competition List (`templates/competitions/list.html`)
- Table of all competitions with sorting
- Filter by status (upcoming/active/completed)
- Search functionality
- Create new competition button (admin)
- Actions: View, Edit, Delete

##### Competition Detail (`templates/competitions/detail.html`)
- Competition information header
- Tabs for different sections:
  - **Overview**: Competition details and statistics
  - **Teams**: Team list with registration form
  - **Matches**: Match schedule and results
  - **Scoreboard**: Live rankings
  - **Settings**: Competition settings (admin)

##### Competition Form (`templates/competitions/form.html`)
- Create/Edit competition form with validation
- Fields: name, description, dates, status
- Bootstrap form styling with validation feedback

#### 4. Team Pages

##### Team List (`templates/teams/list.html`)
- Searchable and sortable table
- Filter by competition
- Team card view option
- Register new team button (admin)

##### Team Detail (`templates/teams/detail.html`)
- Team information header
- Match history table
- Score history with charts (using Chart.js)
- Statistics: average score, wins, rankings

##### Team Form (`templates/teams/form.html`)
- Registration form with validation
- Fields: number, name, school, contact info
- Competition selection dropdown

#### 5. Match Pages

##### Match Schedule (`templates/matches/schedule.html`)
- Calendar/timeline view of matches
- Filter by round type and status
- Current/upcoming matches highlighted
- Create match button (admin)

##### Match Detail (`templates/matches/detail.html`)
- Match information (number, round, time, field)
- Team assignments display
- Score entry form (admin/judge)
- Match control buttons: Start, Complete, Cancel (admin)
- Live timer during match (WebSocket)

##### Match Form (`templates/matches/form.html`)
- Create/edit match form
- Team assignment interface
- Date/time picker
- Field selection

#### 6. Scoreboard Display (`templates/scoreboard/display.html`)
- Full-screen mode toggle
- Live rankings table with auto-refresh
- Current match display with timer
- Next match preview
- Color-coded by ranking position
- Responsive columns: Rank, Team Number, Team Name, Matches, Points
- WebSocket integration for real-time updates

#### 7. Score Entry (`templates/scores/entry.html`)
- Score input form with sections:
  - Autonomous points
  - Teleop points
  - Endgame points
  - Penalties
  - Bonus points
- Real-time total calculation
- Submit and update rankings button
- Previous scores display

#### 8. Admin Panel (`templates/admin/dashboard.html`)
- Overview statistics cards
- Quick actions panel
- Recent activity log
- User management section
- System settings

#### 9. Authentication Pages

##### Login (`templates/auth/login.html`)
- Login form with username/password
- Remember me checkbox
- Bootstrap styled with validation

##### Register (`templates/auth/register.html`)
- User registration form (admin only)
- Role selection
- Form validation

### JavaScript Functionality (`static/js/app.js`)

#### WebSocket Client
```javascript
// Connect to SocketIO
const socket = io();

// Join competition room
socket.emit('join_competition', {competition_id: compId});

// Listen for updates
socket.on('score_updated', (data) => {
    updateScoreboard(data);
});

socket.on('match_started', (data) => {
    updateMatchStatus(data);
    startMatchTimer(data);
});

socket.on('rankings_updated', (data) => {
    updateRankingsTable(data);
});
```

#### Dynamic Features
- Auto-refresh scoreboard every 30 seconds (fallback)
- Live search/filter for tables
- Form validation before submit
- Confirmation dialogs for delete actions
- Toast notifications for success/error messages
- Match timer countdown
- Score calculation on input change
- Chart.js integration for statistics

### CSS Styling (`static/css/custom.css`)
- Custom color scheme for branding
- Responsive design breakpoints
- Print styles for scoreboard
- Animation for score updates
- Highlighted current match row
- Status badges (active, completed, etc.)
- Full-screen scoreboard styling

### Routes Implementation (`app/routes.py`)

Create route handlers for all views:
```python
@app.route('/')                                    # Home page
@app.route('/competitions')                        # Competition list
@app.route('/competitions/<int:id>')              # Competition detail
@app.route('/competitions/create')                # Create competition
@app.route('/competitions/<int:id>/edit')         # Edit competition
@app.route('/teams')                              # Team list
@app.route('/teams/<int:id>')                     # Team detail
@app.route('/teams/create')                       # Create team
@app.route('/matches')                            # Match schedule
@app.route('/matches/<int:id>')                   # Match detail
@app.route('/scoreboard/<int:competition_id>')    # Live scoreboard
@app.route('/admin')                              # Admin dashboard
@app.route('/login')                              # Login page
@app.route('/logout')                             # Logout
```

### UI/UX Requirements
- Mobile-responsive design
- Intuitive navigation
- Accessible forms with proper labels
- Loading indicators for async operations
- Error message display
- Success confirmations
- Keyboard shortcuts for common actions
- Help tooltips for complex features
- Dark mode toggle (bonus feature)

### Testing Checklist
- Test all forms with valid/invalid data
- Verify WebSocket real-time updates
- Test responsive design on mobile/tablet
- Verify admin/judge/viewer permissions
- Test concurrent users updating scores
- Verify match timer accuracy
- Test full-screen scoreboard display

---

## Summary

These prompts provide a complete roadmap for developing a robotic competition scoreboard application:

1. **Prompt 1** defines the complete project scope, requirements, and deliverables
2. **Prompt 2** sets up the minimal Flask application structure and dependencies
3. **Prompt 3** creates the database schema with SQLAlchemy models and relationships
4. **Prompt 4** implements the REST API with all CRUD endpoints and WebSocket events
5. **Prompt 5** builds the user interface with Bootstrap, jQuery, and real-time features

Each prompt builds on the previous one, creating a fully functional, professional-grade web application for managing robotic competitions with real-time score updates and comprehensive management features.
