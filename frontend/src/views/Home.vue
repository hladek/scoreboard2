<template>
  <div>
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">Welcome to Scoreboard2</h1>
      <p class="lead">A modern user management system with authentication and authorization.</p>
    </div>
    <LocationList />
    <UserList v-if="isLoggedIn && isAdmin" />
    <div v-else class="alert alert-info">
      <p class="mb-0">The user list is available to administrators. Please <router-link to="/login">login</router-link> with admin credentials to view all users.</p>
    </div>
  </div>
</template>

<script>
import LocationList from '../components/LocationList.vue';
import UserList from '../components/UserList.vue';
import { useUserStore } from '../stores/user';
import { computed } from 'vue';

export default {
  name: 'Home',
  components: {
    LocationList,
    UserList
  },
  setup() {
    const userStore = useUserStore();
    
    const isLoggedIn = computed(() => userStore.isAuthenticated);
    const isAdmin = computed(() => userStore.isAdmin);
    
    return {
      isLoggedIn,
      isAdmin
    };
  }
};
</script>
