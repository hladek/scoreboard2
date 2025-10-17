const roundService = require('../services/roundService');

class RoundController {
  async createRound(req, res) {
    try {
      const { time, points, judge_notes, round_number, contest_id, team_id } = req.body;

      if (!round_number || !contest_id || !team_id) {
        return res.status(400).json({ error: 'round_number, contest_id, and team_id are required' });
      }

      const round = await roundService.createRound({ time, points, judge_notes, round_number, contest_id, team_id });
      res.status(201).json({ message: 'Round created successfully', round });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateRound(req, res) {
    try {
      const { id } = req.params;
      const roundDetails = req.body;
      const round = await roundService.updateRound(id, roundDetails);
      res.json({ message: 'Round updated successfully', round });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listRounds(req, res) {
    try {
      const { contest_id } = req.query;
      let rounds;
      if (contest_id) {
        rounds = await roundService.getRoundsByContestId(contest_id);
      } else {
        rounds = await roundService.getAllRounds();
      }
      res.json({ rounds });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RoundController();
