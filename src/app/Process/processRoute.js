const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const process = require('./processController')

/**
 * Process API
 * /app/process
 */


// get은 query로 받기. post는 body로

// 1. 운동 루틴 조회 API(완)
router.get('/', jwtMiddleware, process.getProcess)

// 2 운동 루틴 대체 추천 API(완)
router.get('/replace', jwtMiddleware, process.getReplacementRecommendations)

// 3. 마이 캘린더에 기록 API(완)
router.post('/end', jwtMiddleware, process.postMycalendar)

// 4. 결과 데이터 조회 API
router.get('/end', jwtMiddleware, process.getProcessResult)

// // 7. 결과 분석 업데이트 API
// router.put('/analyze', jwtMiddleware, process.)

// // 8. 결과 분석 조회 API
// router.get('/analyze', jwtMiddleware, process.)

module.exports = router;