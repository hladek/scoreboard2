<template>
  <div>
    <div class="jumbotron bg-light p-5 rounded-3 mb-4">
      <h1 class="display-4">Welcome to Scoreboard2</h1>
      <p class="lead">A modern user management system with authentication and authorization.</p>
    </div>
    <LocationList />
  </div>
</template>

<script>
import LocationList from '../components/LocationList.vue';

export default {
  name: 'Home',
  components: {
    LocationList
  }
};
</script>
