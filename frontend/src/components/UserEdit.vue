<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isNew ? 'Add User' : 'Edit User' }}</h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="edit-username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="edit-username"
                v-model="formData.username"
                required
                :disabled="!isNew"
              />
            </div>
            <div class="mb-3">
              <label for="edit-email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="edit-email"
                v-model="formData.email"
                required
              />
            </div>
            <div v-if="isNew" class="mb-3">
              <label for="edit-password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="edit-password"
                v-model="formData.password"
                :required="isNew"
              />
            </div>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="edit-is-admin"
                v-model="formData.is_admin"
              />
              <label class="form-check-label" for="edit-is-admin">
                Admin User
              </label>
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
export default {
  name: 'UserEdit',
  props: {
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {
        username: '',
        email: '',
        password: '',
        is_admin: false
      },
      error: '',
      loading: false
    };
  },
  computed: {
    isNew() {
      return !this.user;
    }
  },
  created() {
    if (this.user) {
      this.formData = {
        username: this.user.username,
        email: this.user.email,
        password: '',
        is_admin: this.user.is_admin || false
      };
    }
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.loading = true;
      
      try {
        // Note: The backend doesn't have update endpoints yet, 
        // so we'll just emit the data for now
        this.$emit('save', this.formData);
        this.close();
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to save user.';
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
