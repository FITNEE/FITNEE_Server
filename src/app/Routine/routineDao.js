const lodash = require('lodash');

// 마이 루틴 조희
async function selectRoutines(connection, userId) {
    const selectRoutinesQuery = `
                  SELECT monCurriIdx, tueCurriIdx, wedCurriIdx, thuCurriIdx, friCurriIdx, satCurriIdx, sunCurriIdx
                  FROM routine
                  WHERE status = 0 AND userId = ?
                  `;
    const [[routines]] = await connection.query(selectRoutinesQuery, userId);
    return routines;
}

// 유명 루틴 조회
async function selectRoutineCurri(connection, curriIdx) {
    const selectRoutineCurriQuery = `
                  SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routineCurri
                  WHERE status = 0 AND routineCurriIdx = ?
                  `;
    const [[routineCurri]] = await connection.query(selectRoutineCurriQuery, curriIdx);

    var routineContent = [];

    for (var i=0; i<10; i++) {
        const selectRoutineDetailQuery = `
                      SELECT healthCategoryIdx, skip, rep0, weight0, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4, rep5, weight5, rep6, weight6, rep7, weight7, rep8, weight8, rep9, weight9
                      FROM routineDetail
                      WHERE status = 0 AND routineDetailIdx = ?
                      `;
        const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routineCurri['detailIdx'+String(i)]);
        
        var detailContent = lodash.pickBy(routineDetail);
        if (routineDetail) {
            routineContent.push(detailContent);
        };
    };

    return routineContent;
}
  
module.exports = {
    selectRoutines,
    selectRoutineCurri,
};