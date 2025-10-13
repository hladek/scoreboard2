<template>
  <div>
    <h3 class="mb-4">User List</h3>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="users.length === 0" class="alert alert-info">
      No users found.
    </div>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover" data-testid="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th v-if="canEdit">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" :data-testid="`user-row-${user.id}`">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span v-if="user.is_admin" class="badge bg-success">Yes</span>
              <span v-else class="badge bg-secondary">No</span>
            </td>
            <td v-if="canEdit">
              <button
                class="btn btn-sm btn-primary"
                @click="editUser(user)"
                :data-testid="`edit-user-${user.id}`"
              >
                Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'UserList',
  props: {
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      users: [],
      loading: false,
      error: ''
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await api.getUsers();
        this.users = response.data.users;
      } catch (error) {
        // If not authenticated or not admin, show a message instead of error
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.error = 'Please login as an admin to view the user list.';
        } else {
          this.error = error.response?.data?.error || 'Failed to load users.';
        }
      } finally {
        this.loading = false;
      }
    },
    editUser(user) {
      this.$emit('edit-user', user);
    }
  }
};
</script>
