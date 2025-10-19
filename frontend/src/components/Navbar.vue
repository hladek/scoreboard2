<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
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
            <router-link class="nav-link" to="/" active-class="active">Home</router-link>
          </li>
          <li v-if="currentLocation" class="nav-item">
            <router-link class="nav-link" :to="`/location/${currentLocation.id}`" active-class="active">{{ currentLocation.name }}</router-link>
          </li>
          <li v-if="currentLocation && isLoggedIn" class="nav-item">
            <router-link class="nav-link" :to="`/location/${currentLocation.id}/teams`" active-class="active"> Teams</router-link>
          </li>
          <li v-if="currentLocation && isLoggedIn" class="nav-item">
            <router-link class="nav-link" :to="`/location/${currentLocation.id}/contests`" active-class="active"> Contests</router-link>
          </li>
          <li v-if="!isLoggedIn" class="nav-item">
            <router-link class="nav-link" to="/login" active-class="active">Login</router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin" active-class="active">Admin</router-link>
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
import { useUserStore } from '../stores/user';
import { useLocationStore } from '../stores/location';
import { computed } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    const userStore = useUserStore();
    const locationStore = useLocationStore();
    
    const isLoggedIn = computed(() => userStore.isAuthenticated);
    const isAdmin = computed(() => userStore.isAdmin);
    const username = computed(() => userStore.username);
    const currentLocation = computed(() => locationStore.currentLocation);
    
    return {
      userStore,
      isLoggedIn,
      isAdmin,
      username,
      currentLocation
    };
  },
  methods: {
    async handleLogout() {
      try {
        await api.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.userStore.logout();
        window.dispatchEvent(new Event('auth-change'));
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  padding: 1rem 0;
}

.nav-link {
  font-size: 1.125rem;
  padding: 0.75rem 1rem !important;
}
</style>
