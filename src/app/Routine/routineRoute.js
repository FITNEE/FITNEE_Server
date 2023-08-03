const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const routine = require('./routineController');

/**
 * Routine API
 * /app/routine
 */

router.use(jwtMiddleware);

// 1. 루틴 등록 API
router.post('/', routine.postRoutine);

// 2. 루틴 일정 조회 API
router.get('/', routine.getRoutineCalendar);

// 3. 루틴 조회 API
router.get('/:routineIdx', routine.getRoutine);

// 4. 루틴 수정 API
router.put('/:routineIdx', routine.putRoutine);

// 4. 루틴 삭제 API
router.delete('/:routineIdx', routine.deleteRoutine);

module.exports = router;