<template>
  <div>
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">Welcome to Scoreboard2</h1>
      <p class="lead">A modern user management system with authentication and authorization.</p>
      <hr class="my-4">
      <p v-if="!isLoggedIn">Please login to view the user list and access admin features.</p>
      <p v-else-if="isAdmin">You have admin access. View and manage users below.</p>
      <p v-else>You are logged in. View the user list below.</p>
    </div>
    <UserList v-if="isLoggedIn && isAdmin" />
    <div v-else class="alert alert-info">
      <p class="mb-0">The user list is available to administrators. Please <router-link to="/login">login</router-link> with admin credentials to view all users.</p>
    </div>
  </div>
</template>

<script>
import UserList from '../components/UserList.vue';

export default {
  name: 'Home',
  components: {
    UserList
  },
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    };
  },
  created() {
    this.checkAuth();
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
    }
  }
};
</script>
