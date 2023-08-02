const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../config/jwtMiddleware');
const routine = require('./routineController');

/**
 * Routine API
 * /app/routine
 */

// 1. 루틴 등록 API
router.post('/', jwtMiddleware, routine.postRoutine);

// 2. 루틴 일정 조회 API
router.get('/', jwtMiddleware, routine.getRoutineCalendar);

// 3. 루틴 조회 API
router.get('/:routineIdx', jwtMiddleware, routine.getRoutine);

// 4. 루틴 수정 API
router.put('/:routineIdx', jwtMiddleware, routine.putRoutine);

// 4. 루틴 삭제 API
router.delete('/:routineIdx', jwtMiddleware, routine.deleteRoutine);

module.exports = router;