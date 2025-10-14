<template>
  <div>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="location">
      <div class="mb-4">
        <h1>{{ location.name }}</h1>
        <p v-if="location.description" class="lead">{{ location.description }}</p>
        <p v-if="location.date" class="text-muted">Date: {{ formatDate(location.date) }}</p>
      </div>

      <div class="row">
        <div class="col-md-6 mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>Teams</h2>
          </div>
          <div v-if="teamsLoading" class="text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="teams.length === 0" class="alert alert-info">
            No teams found for this location.
          </div>
          <div v-else class="list-group">
            <div v-for="team in teams" :key="team.id" class="list-group-item">
              <h5 class="mb-1">{{ team.name }}</h5>
              <p v-if="team.affiliation" class="mb-0 text-muted">{{ team.affiliation }}</p>
            </div>
          </div>
        </div>

        <div class="col-md-6 mb-4">
          <h2>Contests</h2>
          <div v-if="contestsLoading" class="text-center">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="contests.length === 0" class="alert alert-info">
            No contests found for this location.
          </div>
          <div v-else class="list-group">
            <div v-for="contest in contests" :key="contest.id" class="list-group-item">
              <h5 class="mb-1">{{ contest.name }}</h5>
              <p v-if="contest.description" class="mb-1">{{ contest.description }}</p>
              <small v-if="contest.max_rounds" class="text-muted">Max Rounds: {{ contest.max_rounds }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useLocationStore } from '../stores/location';
import { useUserStore } from '../stores/user';
import { computed, onMounted, onUnmounted } from 'vue';

export default {
  name: 'LocationView',
  setup() {
    const locationStore = useLocationStore();
    const userStore = useUserStore();
    
    const location = computed(() => locationStore.currentLocation);
    const teams = computed(() => locationStore.currentLocationTeams);
    const contests = computed(() => locationStore.currentLocationContests);
    const loading = computed(() => locationStore.loading);
    const error = computed(() => locationStore.error);
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    
    return {
      location,
      teams,
      contests,
      loading,
      error,
      isAuthenticated,
      locationStore
    };
  },
  data() {
    return {
      teamsLoading: false,
      contestsLoading: false
    };
  },
  created() {
    this.fetchLocationData();
  },
  unmounted() {
    this.locationStore.clearCurrentLocation();
  },
  methods: {
    async fetchLocationData() {
      const id = this.$route.params.id;
      
      try {
        this.teamsLoading = true;
        this.contestsLoading = true;
        await this.locationStore.fetchLocationData(id);
      } catch (error) {
        console.error('Failed to load location data:', error);
      } finally {
        this.teamsLoading = false;
        this.contestsLoading = false;
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>
