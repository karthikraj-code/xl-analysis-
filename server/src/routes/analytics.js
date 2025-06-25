const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  generateChartData,
  generateInsights,
  getDataSummary,
  getAnalytics,
  downloadChart,
  trackChartUsage
} = require('../controllers/analyticsController');

router.post('/chart', auth, generateChartData);
router.post('/insights/:fileId', auth, generateInsights);
router.get('/summary/:fileId', auth, getDataSummary);
router.post('/chart/download', auth, downloadChart);
router.get('/', auth, getAnalytics);
router.post('/track-chart-usage', auth, trackChartUsage);

module.exports = router; 