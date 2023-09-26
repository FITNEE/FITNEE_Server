const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const dictionary = require('./dictionaryController');

/**
 * Dictionary API
 * /app/dictionary
 */

// 1. 
router.get('/', jwtMiddleware, dictionary.getKeywordByIdx);

// 2. 
router.post('/usersearch', jwtMiddleware, dictionary.postSearchList);

// 3.
router.post('/searchexercise', dictionary.postSearchName);

// 4.
router.get('/exerciseinfo', dictionary.getInformationByparts);

// 5.
router.get('/exercisemethod', dictionary.getMethodByName);

// 6.
router.get('/exercisechat', dictionary.getChattingByName);

// 7.
router.post('/chatting', jwtMiddleware, dictionary.postChatting);

// 8.
router.patch('/deleteChatt', jwtMiddleware, dictionary.deleteChatt)

// 9.
router.put('/chatRead', jwtMiddleware, dictionary.updateChatRead)

// 10.
router.get('/readInfo', jwtMiddleware, dictionary.getReadInfo)

module.exports = router;