const teamService = require('../services/teamService');

class TeamController {
  async createTeam(req, res) {
    try {
      const { name, affiliation, location_id } = req.body;

      if (!name || !affiliation || !location_id) {
        return res.status(400).json({ error: 'Name, affiliation, and location_id are required' });
      }

      const team = await teamService.createTeam(name, affiliation, location_id);
      res.status(201).json({ message: 'Team created successfully', team });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTeam(req, res) {
    try {
      const { id } = req.params;
      const teamDetails = req.body;
      const team = await teamService.updateTeam(id, teamDetails);
      res.json({ message: 'Team updated successfully', team });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTeam(req, res) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }
      res.json({ team });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listTeams(req, res) {
    try {
      const { location_id } = req.query;
      let teams;
      if (location_id) {
        teams = await teamService.getTeamsByLocation(location_id);
      } else {
        teams = await teamService.getAllTeams();
      }
      res.json({ teams });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TeamController();
