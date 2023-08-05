const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const mypage = require('./dictionaryController');

/**
 * Dictionary API
 * /app/dictionary
 */

// 1. 
router.get('/', jwtMiddleware, mypage.getKeywordByIdx);

// 2. 
router.post('/usersearch', jwtMiddleware, mypage.postSearchList);

// 3.
router.get('/exerciseinfo', mypage.getInformationByparts);

// 4.
router.get('/exercisemethod', mypage.getMethodByName);

// 5.
router.get('/exercisechat', mypage.getChattingByName);

// 6.
router.post('/chatting', mypage.postChatting);

// 7.
router.patch('/deleteChatt', jwtMiddleware, mypage.deleteChatt)

module.exports = router;