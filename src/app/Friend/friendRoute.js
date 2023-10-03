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

// 3. 
router.post('/addFriend',jwtMiddleware, freind.addFriend);

// 3.1
router.get('/addFriendList',jwtMiddleware, freind.addFriendList);

// 3.2
router.delete('/cancelAdd',jwtMiddleware, freind.cancelAdd);

// 4.
router.get('/getReceiveList',jwtMiddleware, freind.getReceiveList);

module.exports = router;