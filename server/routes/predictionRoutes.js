// userRoutes.js

const express = require('express');
const router = express.Router();
const { addPrediction } = require('../controllers/predictionController');

// POST route to add a prediction
router.post('/add-prediction', addPrediction);

module.exports = router;
