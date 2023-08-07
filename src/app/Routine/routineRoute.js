const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../middleware/jwtMiddleware');
const gptMiddleware = require('../../middleware/gptMiddleware');
const routine = require('./routineController');

/**
 * Routine API
 * /app/routine
 */

router.use(jwtMiddleware);

// 루틴 예시 생성 API
router.post('/', gptMiddleware, routine.postRoutine);

// 루틴 등록 API
router.post('/calendar', routine.postRoutineCalendar);

// 루틴 일정 조회 API
router.get('/calendar', routine.getRoutineCalendar);

// 루틴 일정 수정 API
router.put('/calendar', routine.putRoutineCalendar);

// 루틴 조회 API
router.get('/:routineIdx', routine.getRoutine);

// 루틴 수정 API
router.put('/:routineIdx', routine.putRoutine);

// 루틴 삭제 API
router.delete('/:routineIdx', routine.deleteRoutine);

module.exports = router;