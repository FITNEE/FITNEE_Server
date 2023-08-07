const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const mypage = require('./mypageController');

/**
 * Mypage API
 * /app/mypage
 */

// 1. 해당 month에 운동한 모든 날짜 반환.
router.get('/', jwtMiddleware, mypage.getExercisedData);

// 2. 
//router.get('/', mypage.getExerciseInfo);

// 3. 
router.get('/record', mypage.getExerciseRecord);

// 4. 유저 정보 조회
router.get('/userinfo',jwtMiddleware, mypage.getUserData);

// 5. 유저 정보 업데이트
router.put('/updateuser', jwtMiddleware, mypage.updateUserData);

// 6. user테이블에 동일 닉네임 존재하는지 확인
router.get('/nickname', mypage.checkUserNameValid);

// 7. 비밀번호 수정
router.put('/updatepwd', jwtMiddleware, mypage.updatePassword);

// 8. 비밀번호 비교
router.post('/comparepwd', jwtMiddleware, mypage.comparePassword);

module.exports = router;