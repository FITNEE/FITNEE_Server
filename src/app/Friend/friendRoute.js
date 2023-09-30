const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const freind = require('./freindController');

/**
 * Freind API
 * /app/freind
 */

// 1. 
router.get('/', jwtMiddleware, freind.getFriendByIdx);

// 2. 
router.post('/searchUser', freind.searchUser);

module.exports = router;