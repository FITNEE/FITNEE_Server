const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../config/jwtMiddleware');
const routine = require('./routineController');

/**
 * Process API
 * /app/process
 */

// 1. 루틴 등록 API
// router.post('/', routine.getRoutine);

// 2. 루틴 일정 조회 API
router.get('/', routine.getRoutineCalendar);

// 3. 루틴 조회 API
router.get('/:routineIdx', routine.getRoutine);

// 4. 루틴 수정 API
// router.patch('/', routine.patchRoutineCurri);

// 4. 루틴 삭제 API
router.delete('/:routineIdx', routine.deleteRoutine);

module.exports = router;