const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const mypage = require('./dictionaryController');

/**
 * Dictionary API
 * /app/dictionary
 */

// 1. 
router.get('/', mypage.getKeywordByIdx);

// 2.
router.get('/exerciseinfo', mypage.getInformationByparts);

// 3.
router.get('/exercisemethod', mypage.getMethodByName);

// 4.
router.get('/exercisechat', mypage.getChattingByName);

// 5.
router.post('/chatting', mypage.postChatting);

// 6.
router.patch('/deleteChatt', jwtMiddleware, mypage.deleteChatt)

module.exports = router;