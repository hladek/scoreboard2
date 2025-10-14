<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? 'Add Team' : 'Edit Team' }}</h5>
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
              <label for="edit-name" class="form-label">Team Name</label>
              <input
                type="text"
                class="form-control"
                id="edit-name"
                v-model="formData.name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="edit-affiliation" class="form-label">Affiliation</label>
              <input
                type="text"
                class="form-control"
                id="edit-affiliation"
                v-model="formData.affiliation"
                placeholder="Optional"
              />
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
  name: 'TeamEdit',
  props: {
    team: {
      type: Object,
      default: null
    },
    locationId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formData: {
        name: '',
        affiliation: ''
      },
      error: '',
      success: '',
      loading: false
    };
  },
  computed: {
    isNew() {
      return !this.team;
    }
  },
  created() {
    if (this.team) {
      this.formData = {
        name: this.team.name,
        affiliation: this.team.affiliation || ''
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
          await api.createTeam(
            this.formData.name,
            this.formData.affiliation,
            this.locationId
          );
          this.success = 'Team created successfully!';
        } else {
          await api.updateTeam(this.team.id, this.formData.name);
          this.success = 'Team updated successfully!';
        }
        
        setTimeout(() => {
          this.$emit('save');
          this.close();
        }, 1000);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to save team.';
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
