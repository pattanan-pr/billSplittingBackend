const express = require('express');
const router = express.Router();
const { calculateBill } = require('../controllers/billController');

// Define the route for bill calculation
router.post('/bill-split', calculateBill);

module.exports = router;
