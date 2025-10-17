const db = require('../config/database');

class RoundService {
  async createRound(roundDetails) {
    const [roundId] = await db('rounds').insert(roundDetails);
    return this.getRoundById(roundId);
  }

  async updateRound(id, roundDetails) {
    await db('rounds').where({ id }).update(roundDetails);
    return this.getRoundById(id);
  }

  async getRoundById(id) {
    return db('rounds').where({ id }).first();
  }

  async getAllRounds() {
    return db('rounds').select('*');
  }

  async getRoundsByContestId(contest_id) {
    return db('rounds').where({ contest_id });
  }
}

module.exports = new RoundService();
