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
    <div v-else-if="contest">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Rounds - {{ contest.name }}</h1>
          <p v-if="contest.description" class="text-muted">{{ contest.description }}</p>
          <p v-if="contest.max_rounds" class="text-muted">Max Rounds: {{ contest.max_rounds }}</p>
        </div>
      </div>

      <div class="mb-4">
        <button 
          v-if="isAuthenticated" 
          class="btn btn-primary" 
          @click="openCreateModal"
        >
          <i class="bi bi-plus-circle"></i> Add Round
        </button>
      </div>

      <div v-if="roundsLoading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading rounds...</span>
        </div>
      </div>
      <div v-else-if="rounds.length === 0" class="alert alert-info">
        No rounds found for this contest.
      </div>
      <div v-else class="table-responsive">
        <table class="table table-striped table-hover">
          <thead>
            <tr>
              <th>Round #</th>
              <th>Team</th>
              <th>Time (s)</th>
              <th>Points</th>
              <th>Status</th>
              <th>Judge Notes</th>
              <th v-if="isAuthenticated">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="round in sortedRounds" :key="round.id">
              <td>{{ round.round_number }}</td>
              <td>{{ getTeamName(round.team_id) }}</td>
              <td>{{ round.time !== null ? round.time : '-' }}</td>
              <td>{{ round.points !== null ? round.points : '-' }}</td>
              <td>
                <span 
                  class="badge" 
                  :class="getStatusBadgeClass(round.status)"
                >
                  {{ round.status || 'N/A' }}
                </span>
              </td>
              <td>{{ round.judge_notes || '-' }}</td>
              <td v-if="isAuthenticated">
                <button
                  class="btn btn-sm btn-primary"
                  @click="openEditModal(round)"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <RoundEdit
      v-if="showEditModal"
      :round="selectedRound"
      :contest-id="contestId"
      :teams="teams"
      @close="closeEditModal"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { useLocationStore } from '../stores/location';
import { useUserStore } from '../stores/user';
import { computed, ref } from 'vue';
import api from '../api';
import RoundEdit from '../components/RoundEdit.vue';

export default {
  name: 'RoundManagementView',
  components: {
    RoundEdit
  },
  setup() {
    const locationStore = useLocationStore();
    const userStore = useUserStore();
    
    const location = computed(() => locationStore.currentLocation);
    const contest = computed(() => locationStore.currentContest);
    const contests = computed(() => locationStore.currentLocationContests);
    const teams = computed(() => locationStore.currentLocationTeams);
    const loading = computed(() => locationStore.loading);
    const error = computed(() => locationStore.error);
    const isAuthenticated = computed(() => userStore.isAuthenticated);
    
    const rounds = ref([]);
    const roundsLoading = ref(false);
    const showEditModal = ref(false);
    const selectedRound = ref(null);
    const contestId = ref(null);
    
    return {
      location,
      contest,
      contests,
      teams,
      loading,
      error,
      isAuthenticated,
      rounds,
      roundsLoading,
      showEditModal,
      selectedRound,
      contestId,
      locationStore
    };
  },
  computed: {
    sortedRounds() {
      if (!Array.isArray(this.rounds)) {
        return [];
      }
      return [...this.rounds].sort((a, b) => {
        if (a.round_number !== b.round_number) {
          return a.round_number - b.round_number;
        }
        return a.id - b.id;
      });
    }
  },
  created() {
    this.contestId = parseInt(this.$route.params.contestId);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        // Use the location store method to fetch contest and all related data
        await this.locationStore.fetchContestById(this.contestId);
        
        // Fetch rounds
        await this.fetchRounds();
        
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    },
    async fetchRounds() {
      try {
        this.roundsLoading = true;
        const response = await api.getRounds(this.contestId);
        this.rounds = response.data;
      } catch (err) {
        console.error('Failed to load rounds:', err);
      } finally {
        this.roundsLoading = false;
      }
    },
    openCreateModal() {
      this.selectedRound = null;
      this.showEditModal = true;
    },
    openEditModal(round) {
      this.selectedRound = round;
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedRound = null;
    },
    async handleSave() {
      this.closeEditModal();
      await this.fetchRounds();
    },
    getTeamName(teamId) {
      const team = this.teams.find(t => t.id === teamId);
      return team ? team.name : 'Unknown Team';
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'completed':
          return 'bg-success';
        case 'pending':
          return 'bg-warning';
        case 'disqualified':
          return 'bg-danger';
        default:
          return 'bg-secondary';
      }
    }
  }
};
</script>
