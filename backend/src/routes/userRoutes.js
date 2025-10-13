const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes
router.post('/logout', authMiddleware, userController.logout);

// Admin-only routes
router.get('/users', authMiddleware, adminMiddleware, userController.listUsers);

module.exports = router;
