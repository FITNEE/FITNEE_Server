const lodash = require('lodash');
const { exceptions } = require('winston');

async function insertRoutine(connection, userId, info, gpt) {
    const selectUserInfo = `
                  SELECT birthYear, gender, height, weight
                  FROM User
                  WHERE userId = ?
                  `;
    const [[responseUserInfo]] = await connection.query(selectUserInfo, userId);

    const openai = gpt.openai;
    const rmSentence = (info.RM)
                        ? `I think I can lift up to ${info.RM}kg when I do squats to the maximum.`
                        : `I don't even know how many squats I can do at a time.`;
    const infoSentence = `
                    I am a ${(responseUserInfo.gender==1) ? "male" : "female"} born in ${responseUserInfo.birthYear},
                    I am ${responseUserInfo.height}cm tall and weight ${responseUserInfo.weight}kg.
                    ${rmSentence}
                    I will do ${info.targets} exercises at ${info.place}.
                    I'm going to exercise on ${info.dayOfWeeks}.
                    `;

    const content = infoSentence + gpt.chatContent;
    const completion = gpt.chatCompletion;
    completion.messages[2].content = content;

    console.log(infoSentence);

    const responseCompletion = await openai.createChatCompletion(completion);
    console.log("---------- gpt completion ----------");
    const responseContent = JSON.parse(responseCompletion.data.choices[0].message.content.replaceAll('\'', '"').replaceAll('`', '"'));
    console.log(responseContent);

    const selectExerciseListQuery = `
                          SELECT name
                          FROM healthCategory
                          `;
    const [exerciseList] = await connection.query(selectExerciseListQuery);

    //
    const responseRoutines = [];
    for (var i=0; i<3; i++) {
        const responseKeys = Object.keys(responseContent[i]);
        const responseValues = Object.values(responseContent[i]);
        const tempRoutineCalendar = {
            id : i+1,
            title : responseContent[i].Title,
            item : []
        };

        for (var j=0; j<responseKeys.length-1; j++) {
            const recRoutine = responseValues[j+1].content;
            const resRoutine = {
                routineIdx : 0,
                day : responseKeys[j+1],
                parts : responseValues[j+1].target,
                exercises : []
            };
            const tempRoutine = {};

            for (var k=0; k<recRoutine.length; k++) {
                const recDetail = recRoutine[k];
                resRoutine.exercises.push({
                    healthCategoryIdx : recDetail.exerciseId,
                    name : exerciseList[recDetail.exerciseId-1].name,
                    set : recDetail.sets
                });

                const tempRoutineDetail = {
                    healthCategoryIdx : recDetail.exerciseId
                };
                for (var l=0; l<recDetail.sets; l++) {
                    tempRoutineDetail['rep'+String(l)] = recDetail.reps;
                    if (recDetail.weights) {
                        tempRoutineDetail['weight'+String(l)] = recDetail.weights[l];
                    }
                };

                const tempRoutineDetailQuery = `
                                      INSERT INTO routineDetail
                                      SET ?;
                                      SELECT LAST_INSERT_ID();
                                      `;
                const [reponseTempRDIdx] = await connection.query(tempRoutineDetailQuery, tempRoutineDetail);
                tempRoutine['detailIdx'+String(k)] = reponseTempRDIdx[1][0]['LAST_INSERT_ID()'];
            };

            const tempRoutineQuery = `
                              INSERT INTO routine
                              SET ?;
                              SELECT LAST_INSERT_ID();
                              `;
            const [responseTempRIdx] = await connection.query(tempRoutineQuery, tempRoutine);
            resRoutine.routineIdx = responseTempRIdx[1][0]['LAST_INSERT_ID()'];

            tempRoutineCalendar.item.push(resRoutine);
        };
        responseRoutines.push(tempRoutineCalendar);
    };

    return responseRoutines;
};

async function insertRoutineCalendar(connection, userId, routineCalendar) {
    const existCheckQuery = `
                      SELECT *
                      FROM routineCalendar
                      WHERE status = 0 AND userId = ?
                      `;

    const [[responseExistCheck]] = await connection.query(existCheckQuery, userId);

    if (responseExistCheck) {
        updateRoutineCalendar(connection, userId, routineCalendar);
    } else {
        routineCalendar.userId = userId;
        const insertRoutineCalendarQuery = `
                            INSERT INTO routineCalendar
                            SET ?
                            `;
        await connection.query(insertRoutineCalendarQuery, routineCalendar);
    }

    return ;
};

// 루틴 일정 조희
async function selectRoutineCalendar(connection, userId) {
    const selectRoutineCalendarQuery = `
                  SELECT monRoutineIdx, tueRoutineIdx, wedRoutineIdx, thuRoutineIdx, friRoutineIdx, satRoutineIdx, sunRoutineIdx
                  FROM routineCalendar
                  WHERE status = 0 AND userId = ?;
                  `;
    const [[routineCalendar]] = await connection.query(selectRoutineCalendarQuery, userId);
    return routineCalendar;
};

// 루틴 조회
async function selectRoutine(connection, routineIdx) {
    const selectExerciseListQuery = `
                          SELECT name
                          FROM healthCategory
                          `;
    const [exerciseList] = await connection.query(selectExerciseListQuery);

    const selectRoutineQuery = `
                  SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routine
                  WHERE routineIdx = ?
                  `;
    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return routine;

    var routineContent = [];
    for (var i=0; i<10; i++) {
        const selectRoutineDetailQuery = `
                      SELECT healthCategoryIdx, rep0, weight0, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4, rep5, weight5, rep6, weight6, rep7, weight7, rep8, weight8, rep9, weight9
                      FROM routineDetail
                      WHERE routineDetailIdx = ?
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
            detailContent['exerciseName'] = exerciseList[routineDetail.healthCategoryIdx-1].name;
            detailContent['content'] = detailItem;
            routineContent.push(detailContent);
        }
    }

    return routineContent;
};

// 루틴 일정 수정
async function updateRoutineCalendar(connection, userId, routineCalendar) {
    const updateRoutineCalendarQuery = `
                              UPDATE routineCalendar
                              SET ?
                              WHERE userId = ?
                              `;
    await connection.query(updateRoutineCalendarQuery, [routineCalendar, userId]);

    return ;
}

// 루틴 수정
async function updateRoutine(connection, userId, routineIdx, routineContent) {
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
                      SELECT @routineIdx := ?;
                      SELECT @changeIdx := ?;

                      UPDATE routineCalendar
                      SET 
                        monRoutineIdx = IF(@routineIdx = monRoutineIdx, @changeIdx, monRoutineIdx),
                        tueRoutineIdx = IF(@routineIdx = tueRoutineIdx, @changeIdx, tueRoutineIdx),
                        wedRoutineIdx = IF(@routineIdx = wedRoutineIdx, @changeIdx, wedRoutineIdx),
                        thuRoutineIdx = IF(@routineIdx = thuRoutineIdx, @changeIdx, thuRoutineIdx),
                        friRoutineIdx = IF(@routineIdx = friRoutineIdx, @changeIdx, friRoutineIdx),
                        satRoutineIdx = IF(@routineIdx = satRoutineIdx, @changeIdx, satRoutineIdx),
                        sunRoutineIdx = IF(@routineIdx = sunRoutineIdx, @changeIdx, sunRoutineIdx)
                      WHERE userId = ?;
                    `;
    deleteRoutine(connection, userId, routineIdx);
    await connection.query(updateRoutineQuery, [routineIdx, resposneInsertRoutine[`LAST_INSERT_ID()`], userId]);

    return ;
};

// 루틴 삭제
async function deleteRoutine(connection, userId, routineIdx) {
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
                  SELECT @routineIdx := ?;

                  UPDATE routineCalendar
                  SET 
                    monRoutineIdx = IF(@routineIdx = monRoutineIdx, 0, monRoutineIdx),
                    tueRoutineIdx = IF(@routineIdx = tueRoutineIdx, 0, tueRoutineIdx),
                    wedRoutineIdx = IF(@routineIdx = wedRoutineIdx, 0, wedRoutineIdx),
                    thuRoutineIdx = IF(@routineIdx = thuRoutineIdx, 0, thuRoutineIdx),
                    friRoutineIdx = IF(@routineIdx = friRoutineIdx, 0, friRoutineIdx),
                    satRoutineIdx = IF(@routineIdx = satRoutineIdx, 0, satRoutineIdx),
                    sunRoutineIdx = IF(@routineIdx = sunRoutineIdx, 0, sunRoutineIdx)
                  WHERE userId = ?;
                  `;
    const deleteRoutine = `
                  UPDATE routine
                  SET status = '1'
                  WHERE routineIdx = ?
                  `;

    await Promise.all([
        connection.query(deleteRoutineCalendar, [routineIdx, userId]),
        connection.query(deleteRoutine, [routineIdx])
    ]);

    return ;
};

async function startProcess(connection, userId, dayOfWeek) {
    const dayOfWeekStr =  dayOfWeek.slice(0,3).toLowerCase() + 'RoutineIdx';
    const getRoutineIdxQuery = `
                      SELECT *
                      FROM routineCalendar
                      WHERE userId = ?
                      `;
    const [[responseGetRoutineIdx]] = await connection.query(getRoutineIdxQuery, userId);
    console.log(responseGetRoutineIdx[dayOfWeekStr]);

    return ;
};


module.exports = {
    insertRoutine,
    insertRoutineCalendar,
    selectRoutineCalendar,
    updateRoutineCalendar,
    selectRoutine,
    updateRoutine,
    deleteRoutine,
    startProcess,
};