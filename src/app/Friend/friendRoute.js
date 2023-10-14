const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const friend = require('./friendController');

/**
 * Freind API
 * /app/freind
 */

// 1. 
router.get('/', jwtMiddleware, friend.getFriendByIdx);

// 2. 
router.post('/searchUser', friend.searchUser);

// 3. 
router.post('/addFriend', jwtMiddleware, friend.addFriend);

// 3.1
router.get('/addFriendList', jwtMiddleware, friend.addFriendList);

// 3.2
router.delete('/cancelAdd', jwtMiddleware, friend.cancelAdd);

// 4.
router.get('/getReceiveList', jwtMiddleware, friend.getReceiveList);

// 4.1
router.put('/accept', jwtMiddleware, friend.acceptFriend);

// 4.2
router.delete('/refuse', jwtMiddleware, friend.refuseFriend);

// 5
router.delete('/delete', jwtMiddleware, friend.deleteFriend);

// pushAlarm test
router.get('/push', friend.pushAlarm);

module.exports = router;