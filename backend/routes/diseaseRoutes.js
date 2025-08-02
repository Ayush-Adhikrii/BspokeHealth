const express = require('express');
const router = express.Router();
const diseaseController = require('../controller/diseaseController');
const { authenticateToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/symptoms', diseaseController.getAllSymptoms);
router.post('/predict', postLimiter, authenticateToken, diseaseController.predictDiseaseAPI);
router.post('/predict-anonymous', postLimiter, diseaseController.predictDiseaseAPI);
module.exports = router;