const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../config/jwtMiddleware');
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

// 3. 운동별 과정 중 조회 API
router.get('/detail/:routineIdx', jwtMiddleware, process.getProcessDetail)

// // 3. 운동 루틴 대체 API
// router.patch('/part/:routineIdx', jwtMiddleware, );

// // db에 routine.status를 운동 유무 boolean (default : 0)
// // 4. 운동 루틴 '전체' 중단 API
// router.patch('/:routineIdx', jwtMiddleware, )

// // Routine Detail Skip
// // 5. 운동 건너뛰기 API
// router.patch('/:routineDetailIdx', jwtMiddleware, )

// // 물어보기
// // 6. 운동 루틴 캘린더 기록 API
// router.patch('/:routineIdx/end', jwtMiddleware, )

// // 7. 운동 결과 개요 API
// router.get('/:routineIdx/end', jwtMiddleware, )

// // 8. 운동 분석 API
// router.get('/:routineIdx/end/detail', jwtMiddleware, )

// // 9. 결과 공유 API
// router.post('/:routineIdx/end/detail', jwtMiddleware, )

module.exports = router;