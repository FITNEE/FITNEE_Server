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
router.get('/', jwtMiddleware, process.getRoutine)

// 2 운동 루틴 대체 추천 API(완)
router.get('/replace/healthCategoryIdx', process.getReplacementRecommendations)

// 3. 운동 루틴 대체 수정
router.patch('replace/healthCategoryIdx', jwtMiddleware, process.patchReplaceExerciseInRoutine)

// 4. 운동 스킵 API(완)
router.patch('/:routineIdx', jwtMiddleware, process.skipExercise)

// 5. 마이 캘린더에 기록 API
router.post('/end/:routineIdx', jwtMiddleware, process.postMycalendar)

// // 7. 운동 루틴 캘린더 기록 API
// router.patch('/:routineIdx/end', jwtMiddleware, )

// // 8. 운동 결과 개요 API
// router.get('/:routineIdx/end', jwtMiddleware, )

// // 9. 운동 분석 API
// router.get('/:routineIdx/end/detail', jwtMiddleware, )


// 보류

// // 5. 운동 루틴 '전체' 중단 API(보류)
// router.patch('/:routineIdx', jwtMiddleware, )

// // 10. 결과 공유 API
// router.post('/:routineIdx/end/detail', jwtMiddleware, )

// // 2. 운동별 과정 전 조회 API(완)
// router.get('/before/:routineIdx', jwtMiddleware, process.getBeforeProcessDetail)

// // 3. 운동별 과정 중 조회 API(완)
// router.get('/detail/:routineIdx', jwtMiddleware, process.getProcessDetail)

module.exports = router;