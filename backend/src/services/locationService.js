const db = require('../config/database');

class LocationService {
  async createLocation(name, date) {
    const [locationId] = await db('locations').insert({
      name,
      date,
      status: 'new',
    });
    return this.getLocationById(locationId);
  }

  async updateLocation(id, locationDetails) {
    await db('locations').where({ id }).update(locationDetails);
    return this.getLocationById(id);
  }

  async getLocationById(id) {
    return db('locations').where({ id }).first();
  }

  async getAllLocations() {
    return db('locations').select('*');
  }

  async getContestsByLocationId(locationId) {
    return db('contests').where({ location_id: locationId }).select('*');
  }

  async getTeamsByLocationId(locationId) {
    return db('teams').where({ location_id: locationId }).select('*');
  }
}

module.exports = new LocationService();
