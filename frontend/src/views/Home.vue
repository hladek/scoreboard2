<template>
  <div>
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">Welcome to Scoreboard2</h1>
      <p class="lead">A modern user management system with authentication and authorization.</p>
      <hr class="my-4">
      <p>View the public user list below or sign in to access admin features.</p>
    </div>
    <UserList />
  </div>
</template>

<script>
import UserList from '../components/UserList.vue';

export default {
  name: 'Home',
  components: {
    UserList
  }
};
</script>
