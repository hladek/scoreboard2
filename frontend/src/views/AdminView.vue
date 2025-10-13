<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Admin Dashboard</h2>
      <button class="btn btn-success" @click="showAddUser">
        <i class="bi bi-plus"></i> Add User
      </button>
    </div>
    <UserList :can-edit="true" @edit-user="showEditUser" />
    <UserEdit
      v-if="showUserEdit"
      :user="selectedUser"
      @close="closeUserEdit"
      @save="saveUser"
    />
  </div>
</template>

<script>
import UserList from '../components/UserList.vue';
import UserEdit from '../components/UserEdit.vue';

export default {
  name: 'AdminView',
  components: {
    UserList,
    UserEdit
  },
  data() {
    return {
      showUserEdit: false,
      selectedUser: null
    };
  },
  methods: {
    showAddUser() {
      this.selectedUser = null;
      this.showUserEdit = true;
    },
    showEditUser(user) {
      this.selectedUser = user;
      this.showUserEdit = true;
    },
    closeUserEdit() {
      this.showUserEdit = false;
      this.selectedUser = null;
    },
    saveUser(userData) {
      console.log('Save user:', userData);
      // TODO: Implement user save when backend supports it
      this.closeUserEdit();
    }
  }
};
</script>
