const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');

// All routes require authentication
router.use(auth);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/block', adminController.blockUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/files', adminController.getAllFiles);
router.get('/files/:userId', adminController.getUserFiles);
router.get('/user-registration-stats', adminController.getUserRegistrationStats);
router.get('/chart-type-usage', analyticsController.getChartTypeUsage);

module.exports = router; 