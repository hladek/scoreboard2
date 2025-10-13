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
  }
};
