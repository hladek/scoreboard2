const express = require('express');
const router = express.Router();
const contestController = require('../controllers/contestController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/contests', contestController.listContests);
router.get('/contests/:id', contestController.getContest);

// Protected routes
router.post('/contests', authMiddleware, contestController.createContest);
router.put('/contests/:id', authMiddleware, contestController.updateContest);

module.exports = router;
