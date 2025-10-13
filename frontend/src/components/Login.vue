<template>
  <div class="row justify-content-center">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Login</h3>
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
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
              data-testid="login-button"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          <div class="text-center mt-3">
            <router-link to="/signup">Don't have an account? Sign up</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.loading = true;
      
      try {
        const response = await api.login(this.username, this.password);
        const { token, user } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        window.dispatchEvent(new Event('auth-change'));
        
        if (user.is_admin) {
          this.$router.push('/admin');
        } else {
          this.$router.push('/');
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
