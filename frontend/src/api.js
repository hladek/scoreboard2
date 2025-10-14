import axios from 'axios';

const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth endpoints
  signup(username, email, password) {
    return apiClient.post('/api/signup', { username, email, password });
  },
  
  login(username, password) {
    return apiClient.post('/api/login', { username, password });
  },
  
  logout() {
    return apiClient.post('/api/logout');
  },
  
  // User endpoints
  getUsers() {
    return apiClient.get('/api/users');
  },

  // Location endpoints
  createLocation(name, date) {
    return apiClient.post('/api/locations', { name, date });
  },

  getLocations() {
    return apiClient.get('/api/locations');
  },

  getLocationById(id) {
    return apiClient.get(`/api/locations/${id}`);
  },

  getContestsByLocationId(id) {
    return apiClient.get(`/api/locations/${id}/contests`);
  },

  getTeamsByLocationId(id) {
    return apiClient.get(`/api/locations/${id}/teams`);
  },

  updateLocation(id, name) {
    return apiClient.put(`/api/locations/${id}`, { name });
  },

  // Team endpoints
  createTeam(name, affiliation, location_id) {
    return apiClient.post('/api/teams', { name, affiliation, location_id });
  },

  getTeams() {
    return apiClient.get('/api/teams');
  },

  getTeamById(id) {
    return apiClient.get(`/api/teams/${id}`);
  },

  updateTeam(id, name) {
    return apiClient.put(`/api/teams/${id}`, { name });
  },

  // Contest endpoints
  createContest(name, description, max_rounds, location_id) {
    return apiClient.post('/api/contests', { name, description, max_rounds, location_id });
  },

  getContests() {
    return apiClient.get('/api/contests');
  },

  getContestById(id) {
    return apiClient.get(`/api/contests/${id}`);
  },

  updateContest(id, name) {
    return apiClient.put(`/api/contests/${id}`, { name });
  }
};
