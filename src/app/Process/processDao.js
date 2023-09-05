const sqlstring = require('sqlstring');

async function getRoutineIdxCheck(connection, dayOfWeek, userId) {
    const checkRoutineIdxQuery = `
        SELECT ${dayOfWeek}RoutineIdx
        FROM routineCalendar
        WHERE userId = ?;
    `;

    const checkRoutineIdx = await connection.query(checkRoutineIdxQuery, userId)
    
    return checkRoutineIdx[0][0][`${dayOfWeek}RoutineIdx`]
}

async function getCheckUserId(connection, userId) {
    const isValidUserQuery = `
        SELECT EXISTS (
            SELECT userId
            FROM User
            WHERE userId = ? AND EXISTS (
                SELECT routineIdx
                FROM myCalendar
                WHERE userId = ? AND routineIdx = ?
            )
        ) AS isValidUser;
    `;
    const [result] = await connection.query(isValidUserQuery, [userId, userId, routineIdx]);

    return result[0].isValidUser === 1;
}

async function selectProcessData(connection, date, userId) {
    // 날짜 값 변환: YYYYMMDD -> YYYY-MM-DD
    const formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');

    const myCalendarProcessQuery = `
        SELECT routineIdx
        FROM myCalendar
        WHERE healthDate = ? AND userId = ?
    `;
    const [routineIdxRows] = await connection.query(myCalendarProcessQuery, [formattedDate, userId]);

    if (routineIdxRows.length === 0) {
        return 0
    }

    const routineIdxList = routineIdxRows.map(row => row.routineIdx);

    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx IN (?);
    `;
    const [routineRows] = await connection.query(selectRoutineQuery, [routineIdxList]);
    const healthCategoryIdxs = [];

    for (const routineRow of routineRows) {
        for (let i = 0; i < 10; i++) {
            const detailIdxValue = routineRow[`detailIdx${i}`];
            if (detailIdxValue !== null && detailIdxValue > 0) {
                healthCategoryIdxs.push(detailIdxValue);
            }
        }
    }

    const selectHealthCategoryIdxQuery = `
        SELECT healthCategoryIdx
        FROM routineDetail
        WHERE routineDetailIdx IN (?);
    `;
    const [healthCategoryIdxRows] = await connection.query(selectHealthCategoryIdxQuery, [healthCategoryIdxs]);
    const healthCategoryIdxList = healthCategoryIdxRows.map(row => row.healthCategoryIdx);

    const selectHealthNameQuery = `
        SELECT name
        FROM healthCategory
        WHERE healthCategoryIdx = ?;
    `;

    const healthNames = [];

    for (const healthCategoryIdx of healthCategoryIdxList) {
        const [healthNameRow] = await connection.query(selectHealthNameQuery, [healthCategoryIdx]);
        healthNames.push(healthNameRow[0].name);
    }

    return healthNames;
}

async function isValidUser(connection, userId, originRoutineIdx) {
    const isValidUserQuery = `
        SELECT EXISTS (
            SELECT userId
            FROM User
            WHERE userId = ? AND EXISTS (
                SELECT routineIdx
                FROM myCalendar
                WHERE userId = ? AND originRoutineIdx = ?
            )
        ) AS isValidUser;
    `;
    const [result] = await connection.query(isValidUserQuery, [userId, userId, originRoutineIdx]);

    return result[0].isValidUser === 1;
}

async function selectUserIdCheck(connection, userId, routineIdx, dayOfWeek) {
    const selectUserIdCheckQuery = `
        SELECT
            CASE
                WHEN (monRoutineIdx = ? AND LEFT(?, 3) = 'mon') THEN TRUE
                WHEN (tueRoutineIdx = ? AND LEFT(?, 3) = 'tue') THEN TRUE
                WHEN (wedRoutineIdx = ? AND LEFT(?, 3) = 'wed') THEN TRUE
                WHEN (thuRoutineIdx = ? AND LEFT(?, 3) = 'thu') THEN TRUE
                WHEN (friRoutineIdx = ? AND LEFT(?, 3) = 'fri') THEN TRUE
                WHEN (satRoutineIdx = ? AND LEFT(?, 3) = 'sat') THEN TRUE
                WHEN (sunRoutineIdx = ? AND LEFT(?, 3) = 'sun') THEN TRUE
                ELSE FALSE
            END AS result
        FROM routineCalendar
        WHERE userId = ?;
    `;

    const [rows] = await connection.query(selectUserIdCheckQuery, [
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        routineIdx, dayOfWeek,
        userId
    ]);

    return rows[0].result;
}

async function selectUserIdx(connection, userId) {
    const selectUserIdxQuery = `
        SELECT userIdx
        FROM User
        WHERE userId = ?;
    `;
    const [userIdxRows] = await connection.query(selectUserIdxQuery, userId);
    const userIdx = userIdxRows.length > 0 ? userIdxRows[0].userIdx : null;

    return userIdx;
}

async function selectTotalWeight(connection, routineIdx) {
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?
    `;
    const [routineRows] = await connection.query(selectRoutineQuery, routineIdx)

    // 빈 배열을 만들어서 0보다 큰 값을 저장할 배열을 초기화합니다.
    const routineDetailIdxList = [];

    // 각 열을 순회하면서 0보다 큰 값을 찾아 배열에 추가합니다.
    for (const row of routineRows) {
        for (let i = 0; i <= 9; i++) {
            const detailIdx = row[`detailIdx${i}`];
            if (detailIdx > 0) {
                routineDetailIdxList.push(detailIdx);
            }
        }
    }
    
    let totalWeight = 0;
    
    for (const routineDetailIdx of routineDetailIdxList) {
        const getTotalWeightQuery = `
        SELECT SUM(
            COALESCE(NULLIF(rep0, 0), 0) * COALESCE(NULLIF(weight0, 0), 0) +
            COALESCE(NULLIF(rep1, 0), 0) * COALESCE(NULLIF(weight1, 0), 0) +
            COALESCE(NULLIF(rep2, 0), 0) * COALESCE(NULLIF(weight2, 0), 0) +
            COALESCE(NULLIF(rep3, 0), 0) * COALESCE(NULLIF(weight3, 0), 0) +
            COALESCE(NULLIF(rep4, 0), 0) * COALESCE(NULLIF(weight4, 0), 0) +
            COALESCE(NULLIF(rep5, 0), 0) * COALESCE(NULLIF(weight5, 0), 0) +
            COALESCE(NULLIF(rep6, 0), 0) * COALESCE(NULLIF(weight6, 0), 0) +
            COALESCE(NULLIF(rep7, 0), 0) * COALESCE(NULLIF(weight7, 0), 0) +
            COALESCE(NULLIF(rep8, 0), 0) * COALESCE(NULLIF(weight8, 0), 0) +
            COALESCE(NULLIF(rep9, 0), 0) * COALESCE(NULLIF(weight9, 0), 0)
        ) AS totalWeight
        FROM routineDetail
        WHERE routineDetailIdx = ?
        `;
    
        const [totalWeightRows] = await connection.query(getTotalWeightQuery, routineDetailIdx);
        // totalWeightRows[0].totalWeight는 문자열로 반환되므로 정수로 변환합니다.
        const totalWeightForDetailIdx = parseInt(totalWeightRows[0].totalWeight, 10);
        
        // 현재 detailIdx에 대한 totalWeight를 누적
        totalWeight += totalWeightForDetailIdx;
    }
    
    // 루프가 끝난 후에 누적된 totalWeight 값을 반환
    return totalWeight;
}

async function selectRoutineIdx(connection, dayOfWeek, userId) {
    
    const selectRoutineIdxQuery = `
        SELECT ${dayOfWeek}RoutineIdx
        FROM routineCalendar
        WHERE userId = ?
    `;
    const [routineIdRows] = await connection.query(selectRoutineIdxQuery, userId);
    
    return routineIdRows[0][`${dayOfWeek}RoutineIdx`];
}

// 총 distance 조회
async function selectTotalDist(connection, routineIdx) {
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?
    `;
    const [routineRows] = await connection.query(selectRoutineQuery, routineIdx);

    const nonZeroDetailIdx = routineRows
        .map((row) => [
            row.detailIdx0,
            row.detailIdx1,
            row.detailIdx2,
            row.detailIdx3,
            row.detailIdx4,
            row.detailIdx5,
            row.detailIdx6,
            row.detailIdx7,
            row.detailIdx8,
            row.detailIdx9
        ])
        .flat()
        .filter((detailIdx) => detailIdx !== 0);

    if (nonZeroDetailIdx.length === 0) {
        return 0; // 0이 아닌 값이 없으면 칼로리도 0
    }

    const selectDistQuery = `
        SELECT SUM(
            CASE
                WHEN rd.rep0 IS NOT NULL THEN rd.rep0 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep1 IS NOT NULL THEN rd.rep1 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep2 IS NOT NULL THEN rd.rep2 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep3 IS NOT NULL THEN rd.rep3 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep4 IS NOT NULL THEN rd.rep4 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep5 IS NOT NULL THEN rd.rep5 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep6 IS NOT NULL THEN rd.rep6 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep7 IS NOT NULL THEN rd.rep7 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep8 IS NOT NULL THEN rd.rep8 * hc.distance
                ELSE 0
            END +
            CASE
                WHEN rd.rep9 IS NOT NULL THEN rd.rep9 * hc.distance
                ELSE 0
            END
        ) AS totalDist
        FROM routineDetail rd
        INNER JOIN healthCategory hc ON rd.healthCategoryIdx = hc.healthCategoryIdx
        WHERE rd.routineDetailIdx IN (?)
    `;

    const [distRows] = await connection.query(selectDistQuery, [nonZeroDetailIdx]);

    const totalDist = distRows[0].totalDist;


    return totalDist;
}

// 총 칼로리 조회
async function selectTotalCalories(connection, routineIdx) {
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?
    `;
    const [routineRows] = await connection.query(selectRoutineQuery, routineIdx);

    const nonZeroDetailIdx = routineRows
        .map((row) => [
            row.detailIdx0,
            row.detailIdx1,
            row.detailIdx2,
            row.detailIdx3,
            row.detailIdx4,
            row.detailIdx5,
            row.detailIdx6,
            row.detailIdx7,
            row.detailIdx8,
            row.detailIdx9
        ])
        .flat()
        .filter((detailIdx) => detailIdx !== 0);

    if (nonZeroDetailIdx.length === 0) {
        return 0; // 0이 아닌 값이 없으면 칼로리도 0
    }

    const selectCaloriesQuery = `
        SELECT SUM(
            CASE
                WHEN rd.rep0 IS NOT NULL THEN rd.rep0 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep1 IS NOT NULL THEN rd.rep1 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep2 IS NOT NULL THEN rd.rep2 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep3 IS NOT NULL THEN rd.rep3 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep4 IS NOT NULL THEN rd.rep4 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep5 IS NOT NULL THEN rd.rep5 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep6 IS NOT NULL THEN rd.rep6 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep7 IS NOT NULL THEN rd.rep7 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep8 IS NOT NULL THEN rd.rep8 * hc.calories
                ELSE 0
            END +
            CASE
                WHEN rd.rep9 IS NOT NULL THEN rd.rep9 * hc.calories
                ELSE 0
            END
        ) AS totalCalories
        FROM routineDetail rd
        INNER JOIN healthCategory hc ON rd.healthCategoryIdx = hc.healthCategoryIdx
        WHERE rd.routineDetailIdx IN (?)
    `;

    const [caloriesRows] = await connection.query(selectCaloriesQuery, [nonZeroDetailIdx]);

    const totalCalories = caloriesRows[0].totalCalories;

    return totalCalories;


}



async function selectTotalTime(connection, userId, todayDate) {
    const selectTotalTimeQuery = `
        SELECT totalExerciseTime
        FROM myCalendar
        WHERE userId = ? AND healthDate = ?;
    `;
    const [totalTimeRows] = await connection.query(selectTotalTimeQuery, [userId, todayDate])

    if(totalTimeRows.length === 0) {
        return 0
    }

    return totalTimeRows[0].totalExerciseTime
}

async function selectDetailIdx(connection, healthCategory) {
    const selectDetailIdxQuery = `
        SELECT routineDetailIdx
        FROM routineDetail
        WHERE healthCategoryIdx = ?
    ;`
    const detailIdx = await connection.query(selectDetailIdxQuery, healthCategory)

    return detailIdx[0]
}

async function selectRoutine(connection, routineIdx) {

    // rouinte row 긁어오기(routine table)
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?;
    `;
    const [[routineRow]] = await connection.query(selectRoutineQuery, routineIdx);

    if (!routineRow) return null;

    // 운동 리스트 가져오기(healthCategory table)
    const exerciseListQuery = `
        SELECT healthCategoryIdx, name, parts, muscle, equipment, caution1, distance, caution2, caution3
        FROM healthCategory;
    `;
    const [exerciseList] = await connection.query(exerciseListQuery);

    // routineDetail row 긁어오기
    const routineContent = [];
    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routineRow[`detailIdx${i}`];
        if (detailIdxValue !== null && detailIdxValue > 0) {
            const selectRoutineDetailQuery = `
                SELECT healthCategoryIdx
                FROM routineDetail
                WHERE routineDetailIdx = ?;
            `;
            const [[routineDetailRow]] = await connection.query(selectRoutineDetailQuery, detailIdxValue);
        
            if (routineDetailRow) {
                const exerciseInfo = exerciseList.find(exercise => exercise.healthCategoryIdx === routineDetailRow.healthCategoryIdx);
                // caution 배열 생성 시 null 값, 공백은 제외
                const cautionArray = [exerciseInfo.caution1, exerciseInfo.caution2, exerciseInfo.caution3].filter(caution => caution !== null && caution.trim() !== '');
                routineContent.push({
                    exerciseInfo: {
                        healthCategoryIdx: exerciseInfo.healthCategoryIdx,
                        exerciseName: exerciseInfo.name,
                        parts: exerciseInfo.parts,
                        muscle: exerciseInfo.muscle,
                        equipment: exerciseInfo.equipment,
                        caution: cautionArray,
                        distance: exerciseInfo.distance
                    },
                });
            }
        }
    }


    return {
        routineContent: routineContent,
    };
}

// 운동 정보 불러오기(healthCategory table)
async function getExerciseInfo(connection, healthCategoryIdx) {
    const selectExerciseQuery = `
        SELECT healthCategoryIdx, name AS exerciseName, rest, time, muscle, parts, equipment, distance, calories, caution1, caution2, caution3
        FROM healthCategory
        WHERE healthCategoryIdx = ?;
    `;
    const [[exerciseInfo]] = await connection.query(selectExerciseQuery, healthCategoryIdx);
    return exerciseInfo;
}

// 운동 세부사항 가져오기(1세트 - 운동횟수, 무게)
async function selectProcessDetail(connection, routineIdx) {

    // routine row 긁어오기
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?;
    `;
    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return [];
    
    const routine_list = [];

    // detailIdx가 0보다 큰 숫자들만 긁어오기
    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routine[`detailIdx${i}`];
        if (detailIdxValue !== null && detailIdxValue > 0) {
            routine_list.push(detailIdxValue);
        }
    }


    // routine table의 detailIdx에 해당하는 값의 routineDetail table의 row 불러오기
    const selectDetailQuery = `
        SELECT rd.routineDetailIdx, rd.healthCategoryIdx,
               rep0, rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8, rep9,
               weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9
        FROM routineDetail AS rd
        WHERE rd.routineDetailIdx IN (?);
    `;
    const [details] = await connection.query(selectDetailQuery, [routine_list]);


    const result = [];

    // routineDetailIdx row의 rep과 weight 다 불러오기
    for (const detail of details) {
        const sets = [];

        // 운동별 시간 누적값
        let exerciseTime = 0

        const exerciseInfo = await getExerciseInfo(connection, detail.healthCategoryIdx);


        for (let i = 0; i < 10; i++) {
            if (detail[`rep${i}`] !== null) {
                sets.push({
                    set: i,
                    rep: detail[`rep${i}`],
                    weight: detail[`weight${i}`] !== null ? detail[`weight${i}`] : 'null',
                });

                // 각 세트의 예측 시간 누적값 계산
                exerciseTime += detail[`rep${i}`] * exerciseInfo.time
            }
        }

        const exerciseWeight = sets.reduce((totalWeight, set) => {
            if (!isNaN(set.weight) && set.weight !== 'null') {
                return totalWeight + set.weight;
            }
            return totalWeight;
        }, 0);
        
        const totalSets = sets.length
        const exerciseCalories = exerciseInfo.calories || 0
        const predictCalories = totalSets * exerciseCalories
        const exerciseDist = exerciseInfo.distance || 0
        const predictDist = totalSets * exerciseDist

        result.push({
            routineDetailIdx: detail.routineDetailIdx,
            exerciseDetails: 
                {
                    healthCategoryIdx: exerciseInfo.healthCategoryIdx,
                    exerciseName: exerciseInfo.exerciseName,
                },
            sets: sets,
            predictTime: exerciseTime,
            exerciseWeight: exerciseWeight,
            predictDist: predictDist,
            rest: exerciseInfo.rest,
            predictCalories: predictCalories,
        });
    }

    return result;
}

async function selectReplaceDetail(connection, healthCategoryIdx) {
    const selectDetailQuery = `
        SELECT rep0, rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8, rep9,
               weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9, skip
        FROM routineDetail
        WHERE healthCategoryIdx = ?;
    `;

    const [details] = await connection.query(selectDetailQuery, healthCategoryIdx);


    const exerciseInfo = await getExerciseInfo(connection, healthCategoryIdx);


    const result = [];

    for (const detail of details) {
        const sets = [];
        let exerciseTime = 0;

        for (let i = 0; i < 10; i++) {
            if (detail[`rep${i}`] !== null && detail[`rep${i}`] !== 0) {
                sets.push({
                    set: i,
                    rep: detail[`rep${i}`],
                    weight: detail[`weight${i}`] !== null ? detail[`weight${i}`] : 'null',
                });
                exerciseTime += detail[`rep${i}`] * exerciseInfo.time;
            }
        }


        const totalSets = sets.length;
        const exerciseCalories = exerciseInfo.calories || 0;
        const predictCalories = totalSets * exerciseCalories;

        result.push({
            routineDetailIdx: detail.routineDetailIdx,
            exerciseDetails: {
                healthCategoryIdx: exerciseInfo.healthCategoryIdx,
                exerciseName: exerciseInfo.exerciseName,
            },
            sets: sets,
            predictTime: exerciseTime,
            rest: exerciseInfo.rest,
            predictCalories: predictCalories,
            replace: detail.replace,
        });
    }

    return result;
}

// 운동별 parts get
async function getExercisePart(connection, healthCategoryIdx) {

    const getExercisePartQuery = `
        SELECT parts
        FROM healthCategory
        WHERE healthCategoryIdx = ?;
    `;
    const [exercisePartRows] = await connection.query(getExercisePartQuery, healthCategoryIdx);


    return exercisePartRows[0].parts;
};


// 랜덤추천
async function getReplacementExercisesLimited(connection, healthCategoryIdx, maxRecommendations) {
    const exercisePart = await getExercisePart(connection, healthCategoryIdx)

    // 대체 운동 추천 (중복 없이)
    const getReplacementExercisesQuery = `
        SELECT name, healthCategoryIdx, parts, muscle, equipment, caution1, caution2, caution3
        FROM healthCategory
        WHERE parts = ? AND healthCategoryIdx <> ?
        ORDER BY RAND()
        LIMIT ?;
    `;

    const [replacementExerciseRows] = await connection.query(getReplacementExercisesQuery, [exercisePart, healthCategoryIdx, maxRecommendations]);

    return replacementExerciseRows;
}

// 실제로 운동한 리스트들 등록
async function insertRoutineIdx(connection, routineContent) {
    const updateRoutine =  {};
    let offset = 0;

    for (var i=0; i<routineContent.length; i++) {
        if(routineContent[i].skip) {
            offset += 1
            continue;
        }
        var updateRoutineDetail = {
            healthCategoryIdx : routineContent[i].exerciseInfo.healthCategoryIdx,
        };

        curContent = routineContent[i].sets;
        for (var j=0; j<curContent.length; j++) {
            updateRoutineDetail["rep"+String(j)] = curContent[j].rep;
            if (curContent[j].weight)
                updateRoutineDetail["weight"+String(j)] = curContent[j].weight;
        };

        console.log(`update routine detail - ` + JSON.stringify(updateRoutineDetail));

        const updateRoutineDetailQuery = `
                              INSERT INTO routineDetail
                              SET ?;
                              SELECT LAST_INSERT_ID();
                              `;
        const [responseUpdateRD] = await connection.query(updateRoutineDetailQuery, updateRoutineDetail);
        updateRoutine["detailIdx"+String(i-offset)] = responseUpdateRD[1][0]['LAST_INSERT_ID()'];
    };

    console.log(`update routine - ` + JSON.stringify(updateRoutine));
    const updateRoutineQuery = `
                          INSERT INTO routine
                          SET ?;
                          SELECT LAST_INSERT_ID();
                          `;
    const [responseUpdateR] = await connection.query(updateRoutineQuery, updateRoutine);
    const updateRIdx = responseUpdateR[1][0]['LAST_INSERT_ID()'];

    return updateRIdx
}

// Insert calendar data
async function insertMyCalendar(connection, userIdx, userId, routineIdx, originRoutineIdx, totalExerciseTime, totalWeight, todayDate, totalCalories, totalDist) {
    const insertMyCalendarQuery = `
    INSERT INTO myCalendar (userIdx, userId, routineIdx, originRoutineIdx, totalExerciseTime, totalWeight, healthDate, totalCalories, totalDist)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const insertParams = [userIdx, userId, routineIdx, originRoutineIdx, totalExerciseTime, totalWeight, todayDate, totalCalories, totalDist];

    const [insertRows] = await connection.query(insertMyCalendarQuery, insertParams);


    return insertRows;
}

// 마이캘린더에서 데이터 조회
async function selectTotalData(connection, userId, todayDate, originRoutineIdx) {
    const latestDataQuery = `
        SELECT totalExerciseTime, totalWeight, totalCalories, totalDist, myCalenderIdx
        FROM myCalendar
        WHERE userId = ? AND healthDate = ? AND originRoutineIdx = ?
    `;

    const [latestDataRow] = await connection.query(latestDataQuery, [userId, todayDate, originRoutineIdx]);
    return latestDataRow[latestDataRow.length-1];
}

// routineIdx 기준으로 마지막 데이터 2개 합차 조회(-1 인덱스와 -2 인덱스 차이)
async function getComparison(connection, userId, originRoutineIdx) {
    // 마지막 두 개의 데이터 조회
    const selectLastTwoDataQuery = `
        SELECT totalExerciseTime, totalWeight, healthDate
        FROM myCalendar
        WHERE userId = ? AND originRoutineIdx = ?
    `;

    const [lastTwoData] = await connection.query(selectLastTwoDataQuery, [userId, originRoutineIdx]);

    if (!lastTwoData || lastTwoData.length < 2) {
        return { exerciseTimeChange: 0, weightChange: 0 };
    }

    // 마지막 두 개 데이터의 차이를 계산합니다
    const exerciseTimeChange = lastTwoData[lastTwoData.length-1].totalExerciseTime - lastTwoData[lastTwoData.length-2].totalExerciseTime;
    const weightChange = lastTwoData[lastTwoData.length-1].totalWeight - lastTwoData[lastTwoData.length-2].totalWeight;

    return { exerciseTimeChange, weightChange };
}

// 한 달 운동 횟수 조회
async function getHealthCount(connection, userId) { 
    const currentMonth = new Date().getMonth() + 1; // 현재 월 가져오기 (1부터 12까지)
    
    const getHealthCountQuery = `
        SELECT COUNT(*) AS count
        FROM myCalendar
        WHERE userId = ? AND MONTH(healthDate) = ?
    `;
    
    // sqlstring을 사용하여 쿼리를 포맷팅합니다.
    const formattedQuery = sqlstring.format(getHealthCountQuery, [userId, currentMonth]);

    // 포맷팅된 쿼리를 실행합니다.
    const selectHealthCount = await connection.query(formattedQuery);

    return selectHealthCount[0][0].count;
}

// myCalendar에 routineIdx 및 날짜 검증
async function getValidRoutineIdx(connection, originRoutineIdx, todayDate) {

    const checkRoutineIdxQuery = `
        SELECT CASE WHEN EXISTS (
            SELECT 1
            FROM myCalendar
            WHERE originRoutineIdx = ? AND healthDate = ?
        ) THEN 1 ELSE 0 END AS \`exists\`;
    `;
    const [rows] = await connection.query(checkRoutineIdxQuery, [originRoutineIdx, todayDate]);
    const exists = rows[0].exists === 1;

    return exists;
}

// myCalendar에서 운동 시간, 무게, 칼로리 조회
async function getRealTotal(connection, userId, date) {
    const selectRealTotalQuery = `
        SELECT SUM(totalExerciseTime) as totalExerciseTime,
               SUM(totalWeight) as totalWeight,
               SUM(totalCalories) as totalCalories,
               SUM(totalDist) as totalDist
        FROM myCalendar
        WHERE userId = ? AND healthDate = ?;
    `;
    const [rows] = await connection.query(selectRealTotalQuery, [userId, date])

    if (rows.length === 0) {
        return null
    }

    const { totalExerciseTime, totalWeight, totalCalories, totalDist } = rows[0]

    return {
        totalExerciseTime,
        totalWeight,
        totalCalories,
        totalDist
    }
}

module.exports = {
    getRoutineIdxCheck,
    selectProcessData,
    insertRoutineIdx,
    selectTotalDist,
    selectTotalData,
    selectTotalTime,
    selectTotalCalories,
    getRealTotal,
    getValidRoutineIdx,
    getComparison,
    getHealthCount,
    selectReplaceDetail,
    isValidUser,
    selectUserIdCheck,
    selectUserIdx,
    selectTotalWeight,
    selectRoutineIdx,
    selectDetailIdx,
    selectRoutine,
    selectProcessDetail,
    getExercisePart,
    getReplacementExercisesLimited,
    insertMyCalendar,
};
