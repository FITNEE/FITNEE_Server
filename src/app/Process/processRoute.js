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
router.get('/replace/:routineIdx', jwtMiddleware, process.getReplacementRecommendations)

// 3. 운동 루틴 대체 수정 API(완)
router.patch('/replace/:routineIdx', jwtMiddleware, process.patchReplaceExerciseInRoutine)

// 4. 운동 스킵 API(완)
router.patch('/:routineIdx', jwtMiddleware, process.skipExercise)

// 5. 마이 캘린더에 기록 API(완)
router.post('/end/:routineIdx', jwtMiddleware, process.postMycalendar)

// 6. 결과 데이터 조회 API
router.get('/end/:routineIdx', jwtMiddleware, process.getProcessResult)

// 7. 결과 분석 조회 API
// router.get('/analyze', jwtMiddleware, process.)

// // 8. 운동 분석 API
// router.get('/:routineIdx/end/detail', jwtMiddleware, )

module.exports = router;