const db = require('../config/database');

class TeamService {
  async createTeam(name, affiliation, location_id) {
    const [teamId] = await db('teams').insert({
      name,
      affiliation,
      location_id,
    });
    return this.getTeamById(teamId);
  }

  async updateTeam(id, teamDetails) {
    await db('teams').where({ id }).update(teamDetails);
    return this.getTeamById(id);
  }

  async getTeamById(id) {
    return db('teams').where({ id }).first();
  }

  async getAllTeams() {
    return db('teams').select('*');
  }

  async getTeamsByLocation(location_id) {
    return db('teams').where({ location_id });
  }
}

module.exports = new TeamService();
