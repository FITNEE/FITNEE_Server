const lodash = require('lodash');

// 루틴 일정 조희
async function selectRoutineCalendar(connection, userId) {
    const selectRoutineCalendarQuery = `
                  SELECT monRoutineIdx, tueRoutineIdx, wedRoutineIdx, thuRoutineIdx, friRoutineIdx, satRoutineIdx, sunRoutineIdx
                  FROM routineCalendar
                  WHERE status = 0 AND userId = ?
                  `;
    const [[routineCalendar]] = await connection.query(selectRoutineCalendarQuery, userId);
    return routineCalendar;
};

// 루틴 조회
async function selectRoutine(connection, routineIdx) {
    const selectRoutineQuery = `
                  SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routine
                  WHERE status = 0 AND routineIdx = ?
                  `;
    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return routine;

    var routineContent = [];
    for (var i=0; i<10; i++) {
        const selectRoutineDetailQuery = `
                      SELECT healthCategoryIdx, skip, rep0, weight0, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4, rep5, weight5, rep6, weight6, rep7, weight7, rep8, weight8, rep9, weight9
                      FROM routineDetail
                      WHERE status = 0 AND routineDetailIdx = ?
                      `;
        const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routine['detailIdx'+String(i)]);
        
        var detailContent = lodash.pickBy(routineDetail);
        if (routineDetail) {
            routineContent.push(detailContent);
        };
    };

    return routineContent;
};

// 루틴 삭제
async function deleteRoutine(connection, userId, routineIdx) {
    const deleteRoutineCalendar = `
                  UPDATE routineCalendar
                  SET
                      monRoutineIdx = CASE WHEN monRoutineIdx = ? THEN 0 ELSE monRoutineIdx END,
                      tueRoutineIdx = CASE WHEN tueRoutineIdx = ? THEN 0 ELSE tueRoutineIdx END,
                      wedRoutineIdx = CASE WHEN wedRoutineIdx = ? THEN 0 ELSE wedRoutineIdx END,
                      thuRoutineIdx = CASE WHEN thuRoutineIdx = ? THEN 0 ELSE thuRoutineIdx END,
                      friRoutineIdx = CASE WHEN friRoutineIdx = ? THEN 0 ELSE friRoutineIdx END,
                      satRoutineIdx = CASE WHEN satRoutineIdx = ? THEN 0 ELSE satRoutineIdx END,
                      sunRoutineIdx = CASE WHEN sunRoutineIdx = ? THEN 0 ELSE sunRoutineIdx END
                  WHERE userId = ?;
                  `;

    const deleteRoutine = `
                  UPDATE routine
                  SET status = '1'
                  WHERE routineIdx = ?
                  `;

    await Promise.all([
        connection.query(deleteRoutineCalendar, [routineIdx, routineIdx, routineIdx, routineIdx, routineIdx, routineIdx, routineIdx, userId]),
        connection.query(deleteRoutine, [routineIdx])
    ]);

    return ;
}
  
module.exports = {
    selectRoutineCalendar,
    selectRoutine,
    deleteRoutine,
};