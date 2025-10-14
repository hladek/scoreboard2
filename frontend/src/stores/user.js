import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  }),

  getters: {
    isAdmin: (state) => state.currentUser?.is_admin || false,
    username: (state) => state.currentUser?.username || '',
    email: (state) => state.currentUser?.email || ''
  },

  actions: {
    setUser(user) {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    },

    setToken(token) {
      this.token = token;
      this.isAuthenticated = !!token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },

    logout() {
      this.currentUser = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    }
  }
});
