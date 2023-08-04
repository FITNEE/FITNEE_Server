const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const routine = require('../Routine/routineController');
const process = require('./processController')

/**
 * Process API
 * /app/process
 */


// 1. 운동 루틴 조회 API(완)
router.get('/:routineIdx', jwtMiddleware, routine.getRoutine);

// 2. 운동별 과정 전 조회 API(완)
router.get('/before/:routineIdx', jwtMiddleware, process.getBeforeProcessDetail)

// 3. 운동별 과정 중 조회 API(완)
router.get('/detail/:routineIdx', jwtMiddleware, process.getProcessDetail)

// 4-1 운동 루틴 대체 추천 API(완)
router.get('/replace/:detailIdx', jwtMiddleware, process.getReplacementRecommendations)

// 4-2. 운동 루틴 대체 수정(완)
router.patch('/replace/exercise', jwtMiddleware, process.replaceExerciseInRoutine);

// // 5. 운동 루틴 '전체' 중단 API(보류)
// router.patch('/:routineIdx', jwtMiddleware, )

// 6. 운동 건너뛰기 API(완)
router.patch('/:routineDetailIdx', jwtMiddleware, process.skipExercise)

// // 7. 시간 데이터 받아오기(부족)
// router.post('/:routineDetailIdx', jwtMiddleware, process.saveTime)

// // 7. 운동 루틴 캘린더 기록 API
// router.patch('/:routineIdx/end', jwtMiddleware, )

// // 8. 운동 결과 개요 API
// router.get('/:routineIdx/end', jwtMiddleware, )

// // 9. 운동 분석 API
// router.get('/:routineIdx/end/detail', jwtMiddleware, )

// 보류
// // 10. 결과 공유 API
// router.post('/:routineIdx/end/detail', jwtMiddleware, )

module.exports = router;