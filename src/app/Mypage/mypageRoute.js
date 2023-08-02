const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../config/jwtMiddleware');
const mypage = require('./mypageController');

/**
 * Mypage API
 * /app/mypage
 */

// 1. 
router.get('/', jwtMiddleware, mypage.getExercisedData);

// 2. 
//router.get('/', mypage.getExerciseInfo);

// 3. 
router.get('/record', mypage.getExerciseRecord);

// 4. 유저 정보 조회(
router.get('/userinfo',jwtMiddleware, mypage.getUserData);

// 5. 유저 정보 업데이트(
//router.patch('/', mypage.updateUserData);

// 6. 비밀번호 수정
//router.patch('/', mypage.updatePassword);

// 7. user테이블에 동일 닉네임 존재하는지 확인
router.get('/nickname', mypage.checkUserNameValid);
    
module.exports = router;