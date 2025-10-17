const express = require('express');
const router = express.Router();
const roundController = require('../controllers/roundController');
const { authMiddleware } = require('../middleware/auth');

router.get('/rounds', authMiddleware, roundController.listRounds);
router.post('/rounds', authMiddleware, roundController.createRound);
router.put('/rounds/:id', authMiddleware, roundController.updateRound);

module.exports = router;
