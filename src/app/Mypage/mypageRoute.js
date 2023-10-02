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

// 2. 선택한 날짜 운동 정보 조회
router.get('/exercise', jwtMiddleware, mypage.getExerciseInfo);

// 3. 최근 일주일 운동 데이터 조회
router.get('/record', jwtMiddleware, mypage.getExerciseRecord);

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

// 9. 쿠폰 등록
router.post('/coupon', jwtMiddleware, mypage.registCode);

// 10. 알림 수신 여부 확인
router.get('/isalarm', jwtMiddleware, mypage.getIsAlarm);

// 11. 알림 수신 여부 수정
router.put('/isalarm', jwtMiddleware, mypage.putIsAlarm);

// 12. 알림 내용 저장
router.post('/alarm', jwtMiddleware, mypage.postAlarm);

// 13. 알림 내역 조회
router.get('/alarm', jwtMiddleware, mypage.getAlarm);


module.exports = router;