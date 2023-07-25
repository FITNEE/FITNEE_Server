module.exports = function(app){
    const routine = require('./routineController');

    // 1. 루틴 등록 API
    app.get('/app/routine', routine.postRoutine);

    // 2. 루틴 조회 API
    app.post('/app/routine', routine.getRoutine);

    // 3. 루틴 수정 API
    app.put('/app/routine', routine.getRoutine);

    // 4. 루틴 삭제 API
    app.delete('/app/routine', routine.getRoutine);
};