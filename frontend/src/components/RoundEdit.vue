<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? 'Add Round' : 'Edit Round' }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div v-if="success" class="alert alert-success" role="alert">
            {{ success }}
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="round-number" class="form-label">Round Number</label>
              <input
                type="number"
                class="form-control"
                id="round-number"
                v-model.number="formData.round_number"
                :disabled="!isNew"
                required
                min="1"
              />
            </div>
            <div class="mb-3">
              <label for="team-id" class="form-label">Team</label>
              <select
                class="form-select"
                id="team-id"
                v-model.number="formData.team_id"
                required
              >
                <option value="">Select a team</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">
                  {{ team.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="time" class="form-label">Time (seconds)</label>
              <input
                type="number"
                class="form-control"
                id="time"
                v-model.number="formData.time"
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
            <div class="mb-3">
              <label for="points" class="form-label">Points</label>
              <input
                type="number"
                class="form-control"
                id="points"
                v-model.number="formData.points"
                min="0"
                placeholder="Optional"
              />
            </div>
            <div class="mb-3">
              <label for="status" class="form-label">Status</label>
              <select
                class="form-select"
                id="status"
                v-model="formData.status"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="disqualified">Disqualified</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="judge-notes" class="form-label">Judge Notes</label>
              <textarea
                class="form-control"
                id="judge-notes"
                v-model="formData.judge_notes"
                rows="3"
                placeholder="Optional"
              ></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleSubmit"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'RoundEdit',
  props: {
    round: {
      type: Object,
      default: null
    },
    contestId: {
      type: Number,
      required: true
    },
    teams: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {
        round_number: 1,
        team_id: '',
        time: null,
        points: null,
        status: '',
        judge_notes: ''
      },
      error: '',
      success: '',
      loading: false
    };
  },
  computed: {
    isNew() {
      return !this.round;
    }
  },
  created() {
    if (this.round) {
      this.formData = {
        round_number: this.round.round_number,
        team_id: this.round.team_id,
        time: this.round.time,
        points: this.round.points,
        status: this.round.status || '',
        judge_notes: this.round.judge_notes || ''
      };
    }
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = '';
      this.loading = true;
      
      try {
        if (this.isNew) {
          await api.createRound(
            this.formData.round_number,
            this.contestId,
            this.formData.team_id,
            this.formData.time,
            this.formData.points,
            this.formData.status,
            this.formData.judge_notes
          );
          this.success = 'Round created successfully!';
        } else {
          await api.updateRound(this.round.id, {
            team_id: this.formData.team_id,
            time: this.formData.time,
            points: this.formData.points,
            status: this.formData.status,
            judge_notes: this.formData.judge_notes
          });
          this.success = 'Round updated successfully!';
        }
        
        setTimeout(() => {
          this.$emit('save');
          this.close();
        }, 1000);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to save round.';
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>
