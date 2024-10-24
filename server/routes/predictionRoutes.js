const express = require('express');
const router = express.Router();
const { addPrediction, showPrediction } = require('../controllers/predictionController');

// POST route to add a prediction
router.post('/add-prediction', addPrediction);

// GET route to show prediction using query parameter
router.get('/show-prediction', showPrediction);

module.exports = router;
