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
          <h1>Contests - {{ location.name }}</h1>
          <p v-if="location.date" class="text-muted">{{ formatDate(location.date) }}</p>
        </div>
        <router-link :to="`/location/${$route.params.id}`" class="btn btn-secondary">
          Back to Location
        </router-link>
      </div>

      <div class="mb-4">
        <button 
          v-if="isAuthenticated" 
          class="btn btn-primary" 
          @click="openCreateModal"
        >
          <i class="bi bi-plus-circle"></i> Add Contest
        </button>
      </div>

      <div v-if="contestsLoading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading contests...</span>
        </div>
      </div>
      <div v-else-if="contests.length === 0" class="alert alert-info">
        No contests found for this location.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Max Rounds</th>
              <th v-if="isAuthenticated">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contest in contests" :key="contest.id">
              <td>{{ contest.name }}</td>
              <td>{{ contest.description || '-' }}</td>
              <td>{{ contest.max_rounds || '-' }}</td>
              <td v-if="isAuthenticated">
                <button
                  class="btn btn-sm btn-primary me-2"
                  @click="openEditModal(contest)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ContestEdit
      v-if="showEditModal"
      :contest="selectedContest"
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
import ContestEdit from '../components/ContestEdit.vue';

export default {
  name: 'ContestManagementView',
  components: {
    ContestEdit
  },
  setup() {
    const locationStore = useLocationStore();
    const userStore = useUserStore();
    
    const location = computed(() => locationStore.currentLocation);
    const contests = computed(() => locationStore.currentLocationContests);
    const loading = computed(() => locationStore.loading);
    const error = computed(() => locationStore.error);
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    
    return {
      location,
      contests,
      loading,
      error,
      isAuthenticated,
      locationStore
    };
  },
  data() {
    return {
      contestsLoading: false,
      showEditModal: false,
      selectedContest: null,
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
        this.contestsLoading = true;
        await this.locationStore.fetchLocationById(this.locationId);
        await this.locationStore.fetchLocationContests(this.locationId);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        this.contestsLoading = false;
      }
    },
    openCreateModal() {
      this.selectedContest = null;
      this.showEditModal = true;
    },
    openEditModal(contest) {
      this.selectedContest = contest;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedContest = null;
    },
    async handleSave() {
      this.closeEditModal();
      await this.locationStore.fetchLocationContests(this.locationId);
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>
