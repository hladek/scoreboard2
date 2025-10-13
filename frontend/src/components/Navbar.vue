<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Scoreboard2</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/signup">Signup</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin">Admin</router-link>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <span class="nav-link">{{ username }}</span>
          </li>
          <li v-if="isLoggedIn" class="nav-item">
            <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import api from '../api';

export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      username: ''
    };
  },
  created() {
    this.checkAuth();
    // Listen for auth changes
    window.addEventListener('auth-change', this.checkAuth);
  },
  beforeUnmount() {
    window.removeEventListener('auth-change', this.checkAuth);
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.isLoggedIn = !!token;
      this.isAdmin = user.is_admin || false;
      this.username = user.username || '';
    },
    async handleLogout() {
      try {
        await api.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.checkAuth();
        window.dispatchEvent(new Event('auth-change'));
        this.$router.push('/');
      }
    }
  }
};
</script>
