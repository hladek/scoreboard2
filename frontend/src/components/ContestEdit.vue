<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? 'Add Contest' : 'Edit Contest' }}</h5>
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
              <label for="edit-name" class="form-label">Contest Name</label>
              <input
                type="text"
                class="form-control"
                id="edit-name"
                v-model="formData.name"
                required
              />
            </div>
            <div class="mb-3">
              <label for="edit-description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="edit-description"
                v-model="formData.description"
                rows="3"
                placeholder="Optional"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="edit-max-rounds" class="form-label">Max Rounds</label>
              <input
                type="number"
                class="form-control"
                id="edit-max-rounds"
                v-model.number="formData.max_rounds"
                min="1"
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
  name: 'ContestEdit',
  props: {
    contest: {
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
        description: '',
        max_rounds: null
      },
      error: '',
      success: '',
      loading: false
    };
  },
  computed: {
    isNew() {
      return !this.contest;
    }
  },
  created() {
    if (this.contest) {
      this.formData = {
        name: this.contest.name,
        description: this.contest.description || '',
        max_rounds: this.contest.max_rounds || null
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
          await api.createContest(
            this.formData.name,
            this.formData.description,
            this.formData.max_rounds,
            this.locationId
          );
          this.success = 'Contest created successfully!';
        } else {
          await api.updateContest(this.contest.id, this.formData.name);
          this.success = 'Contest updated successfully!';
        }
        
        setTimeout(() => {
          this.$emit('save');
          this.close();
        }, 1000);
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to save contest.';
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
