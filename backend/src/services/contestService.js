const db = require('../config/database');

class ContestService {
  async createContest(name, description, max_rounds, location_id) {
    const [contestId] = await db('contests').insert({
      name,
      description,
      max_rounds,
      location_id,
      status: 'new',
    });
    return this.getContestById(contestId);
  }

  async updateContest(id, contestDetails) {
    await db('contests').where({ id }).update(contestDetails);
    return this.getContestById(id);
  }

  async getContestById(id) {
    return db('contests').where({ id }).first();
  }

  async getAllContests() {
    return db('contests').select('*');
  }

  async getContestsByLocation(location_id) {
    return db('contests').where({ location_id });
  }
}

module.exports = new ContestService();
