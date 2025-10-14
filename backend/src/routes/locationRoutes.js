const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/locations', locationController.listLocations);
router.get('/locations/:id', locationController.getLocation);
router.get('/locations/:id/contests', locationController.listContestsByLocation);
router.get('/locations/:id/teams', locationController.listTeamsByLocation);

// Protected routes
router.post('/locations', authMiddleware, locationController.createLocation);
router.put('/locations/:id', authMiddleware, locationController.updateLocation);

module.exports = router;
