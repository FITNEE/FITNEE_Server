const express = require('express');
const router = express.Router();
const promotion = require('./promotionController');

/**
 * Routine API
 * /app/promotion
 */

// 1.
router.post('/', promotion.postPromotion);

module.exports = router;