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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Teams - {{ location.name }}</h1>
          <p v-if="location.date" class="text-muted">{{ formatDate(location.date) }}</p>
        </div>
      </div>

      <div class="mb-4">
        <button 
          v-if="isAuthenticated" 
          class="btn btn-primary" 
          @click="openCreateModal"
        >
          <i class="bi bi-plus-circle"></i> Add Team
        </button>
      </div>

      <div v-if="teamsLoading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading teams...</span>
        </div>
      </div>
      <div v-else-if="teams.length === 0" class="alert alert-info">
        No teams found for this location.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Affiliation</th>
              <th v-if="isAuthenticated">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="team in teams" :key="team.id">
              <td>{{ team.name }}</td>
              <td>{{ team.affiliation || '-' }}</td>
              <td v-if="isAuthenticated">
                <button
                  class="btn btn-sm btn-primary me-2"
                  @click="openEditModal(team)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <TeamEdit
      v-if="showEditModal"
      :team="selectedTeam"
      :location-id="locationId"
      @close="closeEditModal"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { useLocationStore } from '../stores/location';
import { useUserStore } from '../stores/user';
import { computed } from 'vue';
import TeamEdit from '../components/TeamEdit.vue';

export default {
  name: 'TeamManagementView',
  components: {
    TeamEdit
  },
  setup() {
    const locationStore = useLocationStore();
    const userStore = useUserStore();
    
    const location = computed(() => locationStore.currentLocation);
    const teams = computed(() => locationStore.currentLocationTeams);
    const loading = computed(() => locationStore.loading);
    const error = computed(() => locationStore.error);
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    
    return {
      location,
      teams,
      loading,
      error,
      isAuthenticated,
      locationStore
    };
  },
  data() {
    return {
      teamsLoading: false,
      showEditModal: false,
      selectedTeam: null,
      locationId: null
    };
  },
  created() {
    this.locationId = parseInt(this.$route.params.id);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.teamsLoading = true;
        await this.locationStore.fetchLocationById(this.locationId);
        await this.locationStore.fetchLocationTeams(this.locationId);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        this.teamsLoading = false;
      }
    },
    openCreateModal() {
      this.selectedTeam = null;
      this.showEditModal = true;
    },
    openEditModal(team) {
      this.selectedTeam = team;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedTeam = null;
    },
    async handleSave() {
      this.closeEditModal();
      await this.locationStore.fetchLocationTeams(this.locationId);
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>
