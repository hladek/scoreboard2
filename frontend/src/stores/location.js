import { defineStore } from 'pinia';
import api from '../api';

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    currentLocation: null,
    currentLocationTeams: [],
    currentLocationContests: [],
    loading: false,
    error: null
  }),

  getters: {
    getLocationById: (state) => (id) => {
      return state.locations.find(location => location.id === id);
    },
    hasLocations: (state) => state.locations.length > 0
  },

  actions: {
    async fetchLocations() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.getLocations();
        this.locations = response.data.locations;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load locations.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLocationById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.getLocationById(id);
        this.currentLocation = response.data.location;
        return response.data.location;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load location.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLocationTeams(id) {
      try {
        const response = await api.getTeamsByLocationId(id);
        this.currentLocationTeams = response.data.teams;
        return response.data.teams;
      } catch (error) {
        console.error('Failed to load teams:', error);
        throw error;
      }
    },

    async fetchLocationContests(id) {
      try {
        const response = await api.getContestsByLocationId(id);
        this.currentLocationContests = response.data.contests;
        return response.data.contests;
      } catch (error) {
        console.error('Failed to load contests:', error);
        throw error;
      }
    },

    async fetchLocationData(id) {
      await this.fetchLocationById(id);
      await Promise.all([
        this.fetchLocationTeams(id),
        this.fetchLocationContests(id)
      ]);
    },

    setCurrentLocation(location) {
      this.currentLocation = location;
    },

    clearCurrentLocation() {
      this.currentLocation = null;
      this.currentLocationTeams = [];
      this.currentLocationContests = [];
    }
  }
});
