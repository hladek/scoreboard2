const contestService = require('../services/contestService');

class ContestController {
  async createContest(req, res) {
    try {
      const { name, description, max_rounds, location_id } = req.body;

      if (!name || !description || !max_rounds || !location_id) {
        return res.status(400).json({ error: 'Name, description, max_rounds, and location_id are required' });
      }

      const contest = await contestService.createContest(name, description, max_rounds, location_id);
      res.status(201).json({ message: 'Contest created successfully', contest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateContest(req, res) {
    try {
      const { id } = req.params;
      const contestDetails = req.body;
      const contest = await contestService.updateContest(id, contestDetails);
      res.json({ message: 'Contest updated successfully', contest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getContest(req, res) {
    try {
      const { id } = req.params;
      const contest = await contestService.getContestById(id);
      if (!contest) {
        return res.status(404).json({ error: 'Contest not found' });
      }
      res.json({ contest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listContests(req, res) {
    try {
      const { location_id } = req.query;
      let contests;
      if (location_id) {
        contests = await contestService.getContestsByLocation(location_id);
      } else {
        contests = await contestService.getAllContests();
      }
      res.json({ contests });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ContestController();
