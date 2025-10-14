<template>
  <div>
    <h3 class="mb-4">Location List</h3>
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="locations.length === 0" class="alert alert-info">
      No locations found.
    </div>
    <div v-else class="table-responsive">
      <table class="table table-striped table-hover" data-testid="location-table">
        <thead>
          <tr>
            <th>Name</th>
            <th v-if="canEdit">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="location in locations" :key="location.id" :data-testid="`location-row-${location.id}`">
            <td>
              <router-link :to="`/location/${location.id}`">{{ location.name }}</router-link>
            </td>
            <td v-if="canEdit">
              <button
                class="btn btn-sm btn-primary"
                @click="editLocation(location)"
                :data-testid="`edit-location-${location.id}`"
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
  name: 'LocationList',
  props: {
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      locations: [],
      loading: false,
      error: ''
    };
  },
  created() {
    this.fetchLocations();
  },
  methods: {
    async fetchLocations() {
      this.loading = true;
      this.error = '';
      
      try {
        const response = await api.getLocations();
        this.locations = response.data.locations;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load locations.';
      } finally {
        this.loading = false;
      }
    },
    editLocation(location) {
      this.$emit('edit-location', location);
    }
  }
};
</script>
