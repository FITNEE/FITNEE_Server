const lodash = require('lodash');
const { exceptions } = require('winston');

async function insertRoutine(connection, openai, userId, info) {
    const selectUserInfo = `
                  SELECT birthYear, gender, height, weight
                  FROM User
                  WHERE userId = ?
                  `;
    const [[responseUserInfo]] = await connection.query(selectUserInfo, userId);

    // executeGPT(openai);

    console.log((responseUserInfo.gender==1) ? "male" : "female");
    // console.log(responseUserInfo.birthYear);
    // console.log(responseUserInfo.height);
    // console.log(responseUserInfo.weight);
    // console.log(info);
    // console.log(info.RM);
    // console.log(info.targets);
    // console.log(info.place);
    // console.log(info.dayOfWeeks);
    
    return responseUserInfo;
};

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
}

async function executeGPT(openai, gender, age, tall, weight, RM, targets, place, dayOfWeeks) {
    const rmSentence = (RM)
                        ? `I think I can lift up to ${RM}kg when I do squats to the maximum.`
                        : `I don't even know how many squats I can do at a time.`;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [
            {role: "system", content: "You're a fitness trainer who recommends exercise routines."},
            {role: "system", content: `
            exerciseId-exerciseName-note(rep of unit),
            1-Bench Press,
            2-Incline Dumbbell Press,
            3-Chest Press Machine,
            4-Leg Extension,
            5-Lat Pull down,
            6-Barbell Row,
            7-Deadlift,
            8-Dumbbell Row,
            9-Shoulder Press,
            10-Side Lateral Raise,
            11-Front Dumbbell Raise,
            12-Bent Over Lateral Raise,
            13-Seated Row,
            14-Leg Curl,
            15-Leg Press,
            16-Bench Fly,
            17-Hip Thrust,
            18-Hip Raise,
            19-Chest Dips,
            20-Pull Up,
            21-Push Up,
            22-Front Plank-(1sec),
            23-Side Plank-(1sec),
            24-Running-(100m),
            25-Cycling-(100m)
            Create a routine with these exercises
            `
            },
            {role: "user", content: `
            I am a ${gender} born in ${age}, I am ${tall}cm tall and weight ${weight}kg.
            ${rmSentence}
            I will do ${targets} exercises at ${place}.
            I'm going to exercise on ${dayOfWeeks}.
            Please recommend 3 different routines.

            Say only JSON Object format like {'dayOfWeek': dayOfWeek, 'target': targetArea, 'content': ['exerciseId': exerciseId, 'exerciseName': exerciseName, 'sets': numsOfSet(Only Int), 'reps': numsOfRep(Only Int), 'weights'(If exerciseId is between 19 and 25, that is, bare body exercise, get rid of this.): numsOfWeight(Only List(Int as many as numsOfSet))]}.
            In the case of planks, if 1 rep performs 1 second, that is, 10 seconds, using note(rep of unit), rep should be 10.
            In the case of Running and Cycling, if 1 rep performs 100m, that is, 500m, using note(rep of unit), rep should be 5.
            Never Explain.
            `}
        ],
    });

    return completion.data.choices[0].message.content;
}
  
module.exports = {
    insertRoutine,
    selectRoutineCalendar,
    selectRoutine,
    updateRoutine,
    deleteRoutine,
};