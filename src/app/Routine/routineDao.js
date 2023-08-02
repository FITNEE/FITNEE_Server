const lodash = require('lodash');
const { exceptions } = require('winston');

// 루틴 일정 조희
async function selectRoutineCalendar(connection, userId) {
    const selectRoutineCalendarQuery = `
                  SELECT @temp := ?;
                  SELECT monRoutineIdx, tueRoutineIdx, wedRoutineIdx, thuRoutineIdx, friRoutineIdx, satRoutineIdx, sunRoutineIdx
                  FROM routineCalendar
                  WHERE status = 0 AND userId = @temp COLLATE utf8mb4_unicode_ci;
                  `;
    const [routineCalendar] = await connection.query(selectRoutineCalendarQuery, userId);
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

            if (!routineDetail.weight0)
                for (var j=0; j<len; j++)
                    detailItem.push({
                        'rep' : routineDetail['rep'+String(j)]
                    });
            else
                for (var j=0; j<len/2; j++)
                    detailItem.push({
                        'rep' : routineDetail['rep'+String(j)],
                        'weight' : routineDetail['weight'+String(j)]
                    });

            detailContent['healthCategoryIdx'] = routineDetail.healthCategoryIdx;
            detailContent['content'] = detailItem;
            routineContent.push(detailContent);
        }
    }

    return routineContent;
};

// 루틴 수정
async function putRoutine(connection, userId, weekNum, routineIdx, routineContent) {
    weekStr = ['monRoutineIdx', 'tueRoutineIdx', 'wedRoutineIdx', 'thuRoutineIdx', 'friRoutineIdx', 'satRoutineIdx', 'sunRoutineIdx']
    const selectLastInsertIdQuery = `SELECT LAST_INSERT_ID()`;
    var putRoutineContent = {};

    for (var i=0; i<routineContent.length; i++) {
        var detailContent = {};

        detailContent['healthCategoryIdx'] = routineContent[i].healthCategoryIdx;
        for (var j=0; j<routineContent[i].content.length; j++) {
            detailContent['rep'+String(j)] = routineContent[i].content[j].rep;
            if (routineContent[i].content[j].weight)
                detailContent['weight'+String(j)] = routineContent[i].content[j].weight;
        }

        const insertRoutineDetailQuery = `
                          INSERT INTO routineDetail
                          SET ?
                          `;
        await connection.query(insertRoutineDetailQuery, detailContent);

        const [[responseInsertRoutineDetail]] = await connection.query(selectLastInsertIdQuery, detailContent);
        putRoutineContent['detailIdx'+String(i)] = responseInsertRoutineDetail[`LAST_INSERT_ID()`];
    }

    const insertRoutine = `
                      INSERT INTO routine
                      SET ?
                      `;
    await connection.query(insertRoutine, putRoutineContent);

    const [[resposneInsertRoutine]] = await connection.query(selectLastInsertIdQuery);
    const updateRoutineQuery = `
                      UPDATE routineCalendar
                      SET ${weekStr[weekNum]} = ?
                      WHERE userId = ?
                      `;
    deleteRoutine(connection, userId, weekNum, routineIdx);
    await connection.query(updateRoutineQuery, [resposneInsertRoutine[`LAST_INSERT_ID()`], userId]);

    return ;
};

// 루틴 삭제
async function deleteRoutine(connection, userId, weekNum, routineIdx) {
    weekStr = ['monRoutineIdx', 'tueRoutineIdx', 'wedRoutineIdx', 'thuRoutineIdx', 'friRoutineIdx', 'satRoutineIdx', 'sunRoutineIdx']
    const selectRoutineQuery = `
                  SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routine
                  WHERE routineIdx = ?
                  `;

    const [[responseDetailIdx]] = await connection.query(selectRoutineQuery, routineIdx);
    const responseDetailIdxArray = Object.values(lodash.pickBy(responseDetailIdx));
    for (var i=0; i<responseDetailIdxArray.length; i++) {
        const deleteRoutineDetail = `
                      UPDATE routineDetail
                      SET status = '1'
                      WHERE routineDetailIdx = ?
                      `;
        await connection.query(deleteRoutineDetail, responseDetailIdxArray[i]);
    }

    const deleteRoutineCalendar = `
                  UPDATE routineCalendar
                  SET ${weekStr[weekNum]} = 0
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