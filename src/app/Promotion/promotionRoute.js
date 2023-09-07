const express = require('express');
const router = express.Router();
const promotion = require('./promotionController');

/**
 * Routine API
 * /app/promotion
 */


router.route('/').post(promotion.postPromotion);

module.exports = router;