const { response } = require('express');
const { exceptions } = require('winston');
const lodash = require('lodash');
const deepl = require('deepl-node');
const secret = require('../../../config/secret');

async function insertRoutine(connection, userId, info, gpt) {
    const selectUserInfo = `
                  SELECT birthYear, gender, height, weight
                  FROM User
                  WHERE userId = ?
                  `;
    const [[responseUserInfo]] = await connection.query(selectUserInfo, userId);

    console.log('gpt info: ', info);

    const openai = gpt.openai;
    const rmSentence = (info.RM)
                        ? `I think I can lift up to ${info.RM}kg when I do squats to the maximum.`
                        : `I don't even know how many squats I can do at a time.`;
    const weeksSentence = (info.dayOfWeeks.length==1)
                        ? `I only want to work out on ${info.dayOfWeeks}.`
                        : `I'm going to exercise for a total of ${info.dayOfWeeks.length} days on ${info.dayOfWeeks[0]} and ${info.dayOfWeeks.slice(1,).join(', ')}.`;
    const infoSentence = `
                    I am a ${(responseUserInfo.gender==1) ? "male" : "female"} born in ${responseUserInfo.birthYear},
                    I am ${responseUserInfo.height}cm tall and weight ${responseUserInfo.weight}kg.
                    ${rmSentence}
                    I will do only ${info.targets.join(', ')} exercises at ${info.place}.
                    I only want to work out on certain days of the week.
                    ${weeksSentence}
                    I only want to work out on certain days of the week.
                    `;

    const content = infoSentence + gpt.chatContent;
    const completion = gpt.chatCompletion;
    completion.messages[2].content = content;

    console.log(infoSentence);

    var responseContent = [];
    try {
        responseContent = [];

        const [completion1, completion2, completion3] = await Promise.all([
            openai.createChatCompletion(completion),
            openai.createChatCompletion(completion),
            openai.createChatCompletion(completion)
        ]);
    
        responseContent.push(JSON.parse(completion1.data.choices[0].message.content));
        responseContent.push(JSON.parse(completion2.data.choices[0].message.content));
        responseContent.push(JSON.parse(completion3.data.choices[0].message.content));
    } catch (err) {
        console.error(err);

        responseContent = [];

        const [completion1, completion2, completion3] = await Promise.all([
            openai.createChatCompletion(completion),
            openai.createChatCompletion(completion),
            openai.createChatCompletion(completion)
        ]);
    
        responseContent.push(JSON.parse(completion1.data.choices[0].message.content));
        responseContent.push(JSON.parse(completion2.data.choices[0].message.content));
        responseContent.push(JSON.parse(completion3.data.choices[0].message.content));
    }

    console.log("---------- gpt completion ----------");

    // Translate
    const translator = new deepl.Translator(secret.deepLKey);
    for (let i=0; i<responseContent.length; i++) {
        const keys = Object.keys(responseContent[i]);
        const values = [];
        keys.forEach(k => {
            if (k==='Title') values.push(responseContent[i]['Title']);
            else values.push(responseContent[i][k].target);
        });
    
        const translateTexts = await translator.translateText(values.join(','), 'en', 'ko');
        const translateValues = translateTexts.text.split(',').map(item => item.trim());
    
        for (let j=0; j<keys.length; j++) {
            if (keys[j]==='Title') responseContent[i]['Title'] = translateValues[j];
            else if (translateValues[j]==='유산소 운동') responseContent[i][keys[j]].target = '유산소';
            else if (translateValues[j]==='백') responseContent[i][keys[j]].target = '등';
            else if (translateValues[j]==='뒤') responseContent[i][keys[j]].target = '등';
            else responseContent[i][keys[j]].target = translateValues[j];
        };
    };
    console.log(responseContent);

    const selectExerciseListQuery = `
                          SELECT name
                          FROM healthCategory
                          `;
    const [exerciseList] = await connection.query(selectExerciseListQuery);

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
            const tempRoutine = {
                parts : responseValues[j+1].target,
            };

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

    console.log(routineCalendar);

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

// 당일 루틴 조회
async function selectTodayRoutine(connection, userId) {
    const userNicknameQuery = `
                      SELECT userNickname
                      From User
                      WHERE userId = ?
                      `;
    const [[responseUserNickname]] = await connection.query(userNicknameQuery, userId);

    const exerciseDay = new Date();
    exerciseDay.setTime(exerciseDay.getTime()+9*60*60*1000);

    const weekEn = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekKo = ['일', '월', '화', '수', '목', '금', '토'];
    const leftPad = (value) => (value<10) ? `0${value}` : value;
    const toMyString = (source) => {
        const yyyy = source.getFullYear();
        const mm = leftPad(source.getMonth()+1);
        const dd = leftPad(source.getDate());
        return [yyyy, mm, dd].join('. ')+` (${weekKo[source.getDay()]})`;
    };

    const responseToday = {
        todayStrKo : toMyString(exerciseDay),
        userNickName : responseUserNickname.userNickname,
        exerciseCount : 0,
        isToday : true,
        routineIdx : 0,
        exercises : [],
    };

    const existRoutineCalendar = await selectRoutineCalendar(connection, userId);
    if (!Object.keys(lodash.pickBy(existRoutineCalendar)).length) return ;

    var existRoutineIdx = existRoutineCalendar[`${weekEn[exerciseDay.getDay()]}RoutineIdx`];
    if (!existRoutineIdx) {
        responseToday.isToday = false;
        var offset = 1;
        while (!(existRoutineIdx = existRoutineCalendar[`${weekEn[(exerciseDay.getDay()+offset)%7]}RoutineIdx`])) offset += 1;
        exerciseDay.setDate(exerciseDay.getDate()+offset);
        responseToday.todayStrKo = toMyString(exerciseDay);
    };

    responseToday.routineIdx = existRoutineIdx;
    var responseTodayRoutine = await selectRoutine(connection, existRoutineIdx);
    responseTodayRoutine = responseTodayRoutine.routineDetails;

    const exercisePartSets = new Set();

    responseTodayRoutine.forEach(element => {
        curExercise = {};
        curExercise.idx = element.healthCategoryIdx;
        curExercise.name = element.exerciseName;
        responseToday.exercises.push(curExercise);
        
        exercisePartSets.add(element.exerciseParts);
    });

    responseToday.exerciseCount = responseTodayRoutine.length;
    responseToday.exerciseParts = Array.from(exercisePartSets).join(', ');
    return responseToday;
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

async function selectRoutineParts(connection, userId) {
    const weekEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const responseRoutineParts = {
        routineIdx: {},
        parts: {},
    };

    const selectRoutineCalendarQuery = `
                  SELECT monRoutineIdx, tueRoutineIdx, wedRoutineIdx, thuRoutineIdx, friRoutineIdx, satRoutineIdx, sunRoutineIdx
                  FROM routineCalendar
                  WHERE status = 0 AND userId = ?;
                  `;
    const selectRoutinePartsQuery = `
                  SELECT parts
                  FROM routine
                  WHERE routineIdx = ?
                  `;
    const [[routineCalendar]] = await connection.query(selectRoutineCalendarQuery, userId);
    if (!routineCalendar) return;

    for (var i=0; i<7; i++) {
        const curIdx = routineCalendar[`${weekEn[i]}RoutineIdx`];
        responseRoutineParts.routineIdx[`${weekEn[i]}`] = curIdx;

        if (!curIdx) {
            responseRoutineParts.parts[`${weekEn[i]}`] = '';
        } else {
            const [[routineParts]] = await connection.query(selectRoutinePartsQuery, curIdx);
            responseRoutineParts.parts[`${weekEn[i]}`] = routineParts.parts;
        };
    };

    return responseRoutineParts;
};

// 루틴 조회
async function selectRoutine(connection, routineIdx) {
    const selectExerciseListQuery = `
                          SELECT name, parts
                          FROM healthCategory
                          `;
    const [exerciseList] = await connection.query(selectExerciseListQuery);

    const selectRoutineQuery = `
                  SELECT parts, detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routine
                  WHERE routineIdx = ?
                  `;
    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return routine;

    var routineContent = {
        parts : routine.parts,
        routineDetails: []
    };
    for (var i=0; i<10; i++) {
        if (!routine['detailIdx'+String(i)]) continue;
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
            detailContent['exerciseParts'] = exerciseList[routineDetail.healthCategoryIdx-1].parts;
            detailContent['content'] = detailItem;
            routineContent.routineDetails.push(detailContent);
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
    var isChange = false;
    const originRoutine = await selectRoutine(connection, routineIdx);
    const updateRoutine =  {
        parts : originRoutine.parts,
    };

    if (originRoutine.routineDetails.length===routineContent.length) {
        const originIdxs = originRoutine.routineDetails.map(e => e.healthCategoryIdx).sort();
        const changeIdxs = routineContent.map(e => e.healthCategoryIdx).sort();

        for(let i=0; i<originIdxs.length; i++)
            if (originIdxs[i]!==changeIdxs[i])
                { isChange = true; break; }

    } else isChange = true;
    
    for (var i=0; i<routineContent.length; i++) {
        var updateRoutineDetail = {
            healthCategoryIdx : routineContent[i].healthCategoryIdx,
        };

        curContent = routineContent[i].content;
        for (var j=0; j<curContent.length; j++) {
            updateRoutineDetail["rep"+String(j)] = curContent[j].rep;
            if (curContent[j].weight) updateRoutineDetail["weight"+String(j)] = curContent[j].weight;
        };
    
        const updateRoutineDetailQuery = `
                          INSERT INTO routineDetail
                          SET ?;
                          SELECT LAST_INSERT_ID();
        `;
        const [responseUpdateRD] = await connection.query(updateRoutineDetailQuery, updateRoutineDetail);
        updateRoutine["detailIdx"+String(i)] = responseUpdateRD[1][0]['LAST_INSERT_ID()'];
    };

    if (!isChange) {
        const updateRoutineQuery = `
                            UPDATE routine
                            SET ?
                            WHERE routineIdx = ?`;
        await connection.query(updateRoutineQuery, [updateRoutine, routineIdx]);
    } else {
        const updateRoutineQuery = `
                            INSERT INTO routine
                            SET ?;
                            SELECT LAST_INSERT_ID();
                            `;
        const [responseUpdateRoutine] = await connection.query(updateRoutineQuery, updateRoutine);
        const updateRoutineIdx = responseUpdateRoutine[1][0]['LAST_INSERT_ID()'];

        const updateRoutineCalendarQuery = `
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
        await connection.query(updateRoutineCalendarQuery, [routineIdx, updateRoutineIdx, userId]);
    };

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

async function endProcess(connection, userId) {
    const leftPad = (value) => (value<10) ? `0${value}` : value;
    const toMyString = (date, offset=0) => {
        const source = new Date(date.setDate(date.getDate()+offset));
        const yyyy = source.getFullYear();
        const mm = leftPad(source.getMonth()+1);
        const dd = leftPad(source.getDate());
        return [yyyy, mm, dd].join('-');
    };

    const today = new Date();
    today.setTime(today.getTime()+9*60*60*1000);

    const todayProcessQuery = `
                      SELECT routineIdx, originRoutineIdx, totalExerciseTime
                      FROM myCalendar
                      WHERE healthDate = ?
                      AND userId = ?
                      ORDER BY updatedAt DESC
                      LIMIT 1
                      `;
    const [todayProcess] = await connection.query(todayProcessQuery, [toMyString(today), userId]);
    if (!todayProcess.length) return ;

    const lastProcessQuery = `
                      SELECT routineIdx, totalExerciseTime
                      FROM myCalendar
                      WHERE healthDate BETWEEN ? and ?
                      AND originRoutineIdx = ?
                      AND userId = ?
                      ORDER BY updatedAt DESC
                      LIMIT 1
                      `;
    const [lastProcess] = await connection.query(lastProcessQuery, [toMyString(today, -7-today.getDay()), toMyString(today, 6), todayProcess[0].originRoutineIdx, userId]);
    if (!lastProcess.length) return ;
    
    const diffPerTime = (todayProcess[0].totalExerciseTime-lastProcess[0].totalExerciseTime)/todayProcess[0].totalExerciseTime;

    const todayRoutineContent = await selectRoutine(connection, todayProcess[0].routineIdx);
    const lastRoutineContent = await selectRoutine(connection, lastProcess[0].routineIdx);
    const todayRoutine = todayRoutineContent.routineDetails;
    const lastRoutine = lastRoutineContent.routineDetails;
    const responseRoutineContent = [];

    console.log("End Process - todayProcess");
    console.log(todayProcess);
    console.log(JSON.stringify(todayRoutine));
    console.log("End Process - lastProcess");
    console.log(lastProcess);
    console.log(JSON.stringify(lastRoutine));

    for (var i=0; i<todayRoutine.length; i++) {
        for (var j=0; j<lastRoutine.length; j++)
            if (lastRoutine[j].healthCategoryIdx === todayRoutine[i].healthCategoryIdx) break;
        const responseRoutine = {
            healthCategoryIdx : todayRoutine[i].healthCategoryIdx,
            exerciseName : todayRoutine[i].exerciseName,
            exerciseParts : todayRoutine[i].exerciseParts,
            plusRep : 0,
            plusWeight : 0,
            plusSet : 0,
            content : [],
        };

        const isExistWeight = (todayRoutine[i].content[0].weight) ? true : false;

        var todayTotalReps = 0;
        var lastTotalReps = 0;
        var todayTotalWeights = 0;
        var lastTotalWeights = 0;
        todayRoutine[i].content.forEach(element => {todayTotalReps+=element.rep; if (isExistWeight) todayTotalWeights+=element.weight;});
        lastRoutine[j].content.forEach(element => {lastTotalReps+=element.rep; if (isExistWeight) lastTotalWeights+=element.weight;});

        const diffPerRep = (todayTotalReps-lastTotalReps)/todayTotalReps;
        const diffPerWeight = isExistWeight ? (todayTotalWeights-lastTotalWeights)/todayTotalWeights : 0;
        const offset = diffPerRep+diffPerWeight-diffPerTime;
        const flag = (offset>=0) ? 1 : -1;

        const offsetRep = (todayRoutine[i].content[0].rep<=20) ? 2 : 5;
        const offsetWeight = isExistWeight ? (todayRoutine[i].content[0].weight<=20) ? 2 : 5 : 0;
        const flagRWP = (diffPerWeight < diffPerRep-diffPerTime);

        if (offset>0.35 || offset<-0.35) {
            responseRoutine.plusRep = offsetRep*flag;
            responseRoutine.plusWeight = offsetWeight*flag;
            responseRoutine.content = todayRoutine[i].content;

            responseRoutine.content.forEach(element => {
                element.rep += offsetRep*flag
                if (isExistWeight) element.weight += offsetWeight*flag;
            });

        } else if (offset>0.25) {
            responseRoutine.plusSet = 1;

            tempTodayContent = todayRoutine[i].content;
            tempRoutineDetail = { rep : tempTodayContent[0].rep };
            if (isExistWeight) tempRoutineDetail.weight = (tempTodayContent.length>1) ? 2*tempTodayContent[0].weight-tempTodayContent[1].weight : tempTodayContent[0].weight;
            tempTodayContent.unshift(tempRoutineDetail);

            responseRoutine.content = tempTodayContent;

        } else if (offset<-0.25 && todayRoutine[i].content.length>2) {
            responseRoutine.plusSet = -1;

            responseRoutine.content = todayRoutine[i].content;
            responseRoutine.content.sihft();

        } else if (offset>0.15 || offset<-0.25) {
            responseRoutine.plusRep = offsetRep*flag;
            responseRoutine.plusWeight = offsetWeight*flag;
            responseRoutine.content = todayRoutine[i].content;

            responseRoutine.content.forEach(element => {
                element.rep += (flagRWP&&isExistWeight) ? 0 : offsetRep*flag
                if (isExistWeight) element.weight += flagRWP ? offsetWeight*flag : 0;
            });

        } else {
            responseRoutine.content = todayRoutine[i].content;
        };

        responseRoutineContent.push(responseRoutine);
    };

    await updateRoutine(connection, userId, todayProcess[0].originRoutineIdx, responseRoutineContent);

    return responseRoutineContent;
};

// 루틴 일정 수정
async function insertLastProcess(connection, userId, date, originIdx, content) {
    const userInfoQuery = `
                  SELECT userIdx
                  FROM User
                  WHERE userId = ?
                  `;
    const [[responseUserInfo]] = await connection.query(userInfoQuery, userId);

    const responseRoutine = await selectRoutine(connection, originIdx);
    const updateRoutine =  {
        parts : responseRoutine.parts,
    };
    for (var i=0; i<content.length; i++) {
        var updateRoutineDetail = {
            healthCategoryIdx : content[i].healthCategoryIdx,
        };

        curContent = content[i].content;
        for (var j=0; j<curContent.length; j++) {
            updateRoutineDetail["rep"+String(j)] = curContent[j].rep;
            if (curContent[j].weight)
                updateRoutineDetail["weight"+String(j)] = curContent[j].weight;
        };

        const updateRoutineDetailQuery = `
                              INSERT INTO routineDetail
                              SET ?;
                              SELECT LAST_INSERT_ID();
                              `;
        const [responseUpdateRD] = await connection.query(updateRoutineDetailQuery, updateRoutineDetail);
        updateRoutine["detailIdx"+String(i)] = responseUpdateRD[1][0]['LAST_INSERT_ID()'];
    };

    const updateRoutineQuery = `
                        INSERT INTO routine
                        SET ?;
                        SELECT LAST_INSERT_ID();
                        `;
    const [responseUpdateRoutine] = await connection.query(updateRoutineQuery, updateRoutine);
    const updateRoutineIdx = responseUpdateRoutine[1][0]['LAST_INSERT_ID()'];

    const lastProcess = {
        userIdx : responseUserInfo.userIdx,
        userId : userId,
        routineIdx : updateRoutineIdx,
        originRoutineIdx : originIdx,
        healthDate : date
    };

    console.log('insertLastProcess - ', updateRoutine);
    console.log('insertLastProcess - ', lastProcess);

    const lastProcessQuery = `
                      INSERT INTO myCalendar
                      SET ?
                      `;

    await connection.query(lastProcessQuery, lastProcess);

    return ;

    // const responseTodayInfo = await selectTodayRoutine(connection, userId);
    // const routineToday = await selectRoutine(connection, responseTodayInfo.routineIdx);
    // const updateRoutine =  {
    //     parts : routineToday.parts,
    // };

    // const routineContent = routineToday.routineDetails;

    // for (var i=0; i<routineContent.length; i++) {
    //     var updateRoutineDetail = {
    //         healthCategoryIdx : routineContent[i].healthCategoryIdx,
    //     };

    //     curContent = routineContent[i].content;
    //     for (var j=0; j<curContent.length; j++) {
    //         updateRoutineDetail["rep"+String(j)] = curContent[j].rep-2;
    //         if (curContent[j].weight)
    //             updateRoutineDetail["weight"+String(j)] = curContent[j].weight;
    //     };

    //     const updateRoutineDetailQuery = `
    //                           INSERT INTO routineDetail
    //                           SET ?;
    //                           SELECT LAST_INSERT_ID();
    //                           `;
    //     const [responseUpdateRD] = await connection.query(updateRoutineDetailQuery, updateRoutineDetail);
    //     updateRoutine["detailIdx"+String(i)] = responseUpdateRD[1][0]['LAST_INSERT_ID()'];
    // };

    // const updateRoutineQuery = `
    //                     INSERT INTO routine
    //                     SET ?;
    //                     SELECT LAST_INSERT_ID();
    //                     `;
    // const [responseUpdateRoutine] = await connection.query(updateRoutineQuery, updateRoutine);
    // const updateRoutineIdx = responseUpdateRoutine[1][0]['LAST_INSERT_ID()'];

    // const lastProcess = {
    //     userIdx : responseUserInfo.userIdx,
    //     userId : userId,
    //     routineIdx : updateRoutineIdx,
    //     originRoutineIdx : responseTodayInfo.routineIdx,
    //     healthDate : date
    // };

    // console.log('insertLastProcess - ', updateRoutine);
    // console.log('insertLastProcess - ', lastProcess);

    // const lastProcessQuery = `
    //                   INSERT INTO myCalendar
    //                   SET ?
    //                   `;

    // await connection.query(lastProcessQuery, lastProcess);

    // return ;
};

module.exports = {
    insertRoutine,
    insertRoutineCalendar,
    selectRoutineCalendar,
    updateRoutineCalendar,
    selectRoutineParts,
    selectTodayRoutine,
    selectRoutine,
    updateRoutine,
    deleteRoutine,
    endProcess,
    insertLastProcess
};