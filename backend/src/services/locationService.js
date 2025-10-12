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
}

module.exports = new LocationService();
