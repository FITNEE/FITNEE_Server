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
                      SELECT healthCategoryIdx, rep0, weight0, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4, rep5, weight5, rep6, weight6, rep7, weight7, rep8, weight8, rep9, weight9
                      FROM routineDetail
                      WHERE status = 0 AND routineDetailIdx = ?
                      `;
        const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routine['detailIdx'+String(i)]);
        
        var routineDetailPickBy = lodash.pickBy(routineDetail);
        var detailContent = {};
        if (routineDetail) {
            var len = Object.keys(routineDetailPickBy).length-1;
            var detailItem = [];
            detailContent.healthCategoryIdx = routineDetail.healthCategoryIdx;
            if (!routineDetail.weight0) { 
                for (var j=0; j<len; j++) {
                    detailItem.push({
                        'rep' : routineDetail['rep'+String(j)]
                    });
                }
            } else {
                for (var j=0; j<len/2; j++) {
                    detailItem.push({
                        'rep' : routineDetail['rep'+String(j)],
                        'weight' : routineDetail['weight'+String(j)]
                    });
                }
            }
            detailContent.content = detailItem;
            routineContent.push(detailContent);
        }
    }

    return routineContent;
};

// 루틴 수정
async function putRoutine(connection, routineIdx, routineContent) {
    // for (var i=0; i<routineContent.length; i++) {
    // }
    const putRoutine = `
                  INSERT INTO routineDetail (${Object.keys(routineContent[0]).toString()})
                  VALUES (${Object.values(routineContent[0]).toString()})
                  `;

    console.log(Object.keys(routineContent[0]))
    console.log(Object.values(routineContent[0]))
    console.log(putRoutine);

    await connection.query(putRoutine);

    return ;
};

// 루틴 삭제
async function deleteRoutine(connection, userId, routineIdx) {
    const deleteRoutineCalendar = `
                  UPDATE routineCalendar
                  SET
                      monRoutineIdx = CASE WHEN monRoutineIdx = ${routineIdx} THEN 0 ELSE monRoutineIdx END,
                      tueRoutineIdx = CASE WHEN tueRoutineIdx = ${routineIdx} THEN 0 ELSE tueRoutineIdx END,
                      wedRoutineIdx = CASE WHEN wedRoutineIdx = ${routineIdx} THEN 0 ELSE wedRoutineIdx END,
                      thuRoutineIdx = CASE WHEN thuRoutineIdx = ${routineIdx} THEN 0 ELSE thuRoutineIdx END,
                      friRoutineIdx = CASE WHEN friRoutineIdx = ${routineIdx} THEN 0 ELSE friRoutineIdx END,
                      satRoutineIdx = CASE WHEN satRoutineIdx = ${routineIdx} THEN 0 ELSE satRoutineIdx END,
                      sunRoutineIdx = CASE WHEN sunRoutineIdx = ${routineIdx} THEN 0 ELSE sunRoutineIdx END
                  WHERE userId = ?;
                  `;

    const deleteRoutine = `
                  UPDATE routine
                  SET status = '1'
                  WHERE routineIdx = ?
                  `;

    await Promise.all([
        connection.query(deleteRoutineCalendar, [userId]),
        connection.query(deleteRoutine, [routineIdx])
    ]);

    return ;
}
  
module.exports = {
    selectRoutineCalendar,
    selectRoutine,
    putRoutine,
    deleteRoutine,
};