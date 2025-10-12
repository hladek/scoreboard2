const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/teams', teamController.listTeams);
router.get('/teams/:id', teamController.getTeam);

// Protected routes
router.post('/teams', authMiddleware, teamController.createTeam);
router.put('/teams/:id', authMiddleware, teamController.updateTeam);

module.exports = router;
