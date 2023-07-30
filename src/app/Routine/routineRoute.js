module.exports = function(app){
    const routine = require('./routineController');

    // 1. 루틴 등록 API
    // app.post('/app/routine', routine.getRoutine);

    // 2. 루틴 일정 조회 API
    app.get('/app/routine_calendar', routine.getRoutineCalendar);

    // 3. 루틴 조회 API
    app.get('/app/routine', routine.getRoutine);

    // 4. 루틴 수정 API
    // app.patch('/app/routine', routine.patchRoutineCurri);

    // 4. 루틴 삭제 API
    // app.delete('/app/routine', routine.getRoutine);
};