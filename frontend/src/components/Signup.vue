<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Sign Up</h3>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
          <div v-if="success" class="alert alert-success" role="alert">
            Account created successfully! Redirecting to login...
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="username"
                required
                data-testid="username-input"
              />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
                required
                data-testid="email-input"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="password"
                required
                data-testid="password-input"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
              data-testid="signup-button"
            >
              {{ loading ? 'Creating account...' : 'Sign Up' }}
            </button>
          </form>
          <div class="text-center mt-3">
            <router-link to="/login">Already have an account? Login</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'Signup',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      error: '',
      success: false,
      loading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.success = false;
      this.loading = true;
      
      try {
        await api.signup(this.username, this.email, this.password);
        this.success = true;
        
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        this.error = error.response?.data?.error || 'Signup failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
