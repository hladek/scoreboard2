const locationService = require('../services/locationService');

class LocationController {
  async createLocation(req, res) {
    try {
      const { name, date } = req.body;

      if (!name || !date) {
        return res.status(400).json({ error: 'Name and date are required' });
      }

      const location = await locationService.createLocation(name, date);
      res.status(201).json({ message: 'Location created successfully', location });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateLocation(req, res) {
    try {
      const { id } = req.params;
      const locationDetails = req.body;
      const location = await locationService.updateLocation(id, locationDetails);
      res.json({ message: 'Location updated successfully', location });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLocation(req, res) {
    try {
      const { id } = req.params;
      const location = await locationService.getLocationById(id);
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
      res.json({ location });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listLocations(req, res) {
    try {
      const locations = await locationService.getAllLocations();
      res.json({ locations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listContestsByLocation(req, res) {
    try {
      const { id } = req.params;
      const contests = await locationService.getContestsByLocationId(id);
      res.json({ contests });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listTeamsByLocation(req, res) {
    try {
      const { id } = req.params;
      const teams = await locationService.getTeamsByLocationId(id);
      res.json({ teams });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new LocationController();
