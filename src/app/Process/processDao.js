const sqlstring = require('sqlstring');

async function isValidUser(connection, userId, routineIdx) {
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


    const caseClauses = [];
    for (let i = 0; i < 10; i++) {
        caseClauses.push(`CASE WHEN weight${i} > 0 THEN weight${i} ELSE 0 END`);
    }

    const routineDetailIdxList = routineRows.map(row => row.detailIdx0)
        .concat(routineRows.map(row => row.detailIdx1))
        .concat(routineRows.map(row => row.detailIdx2))
        .concat(routineRows.map(row => row.detailIdx3))
        .concat(routineRows.map(row => row.detailIdx4))
        .concat(routineRows.map(row => row.detailIdx5))
        .concat(routineRows.map(row => row.detailIdx6))
        .concat(routineRows.map(row => row.detailIdx7))
        .concat(routineRows.map(row => row.detailIdx8))
        .concat(routineRows.map(row => row.detailIdx9))
        .filter(detailIdx => detailIdx !== 0)
        .join(", ");

    const selectDetailRows = `SELECT SUM(${caseClauses.join(" + ")}) AS totalWeight
    FROM routineDetail
    WHERE routineDetailIdx IN (${routineDetailIdxList})
        AND (${caseClauses.join(" + ")}) > 0;`

    const [TotalWeight] = await connection.query(selectDetailRows)

    return TotalWeight
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
                // caution 배열 생성 시 null 값은 제외
                const cautionArray = [exerciseInfo.caution1, exerciseInfo.caution2, exerciseInfo.caution3].filter(caution => caution !== null);
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
        SELECT healthCategoryIdx, name AS exerciseName, rest, time, muscle, parts,  equipment, calories, caution1, caution2, caution3
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
               weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9, skip
        FROM routineDetail AS rd
        WHERE rd.routineDetailIdx IN (?);
    `;
    const [details] = await connection.query(selectDetailQuery, [routine_list]);


    const result = [];

    // routineDetailIdx row의 rep과 weight 다 불러오기
    for (const detail of details) {
        const sets = [];

        // 운동별 예측 시간 누적값
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
            rest: exerciseInfo.rest,
            predictCalories: predictCalories,
            skip: detail.skip
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

    console.log("details:", [details])

    const exerciseInfo = await getExerciseInfo(connection, healthCategoryIdx);

    console.log("exerciseInfo:", exerciseInfo)

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




// async function selectRoutineIdx(connection, dayOfWeek, userId) {
//     // routineIdx 긁어오기
//     const selectRoutineIdx = `
//         SELECT ${dayOfWeek}RoutineIdx
//         FROM routineCalendar
//         WHERE userId = ?
//     `;
//     const [routineIdRows] = await connection.query(selectRoutineIdx, userId);
//     const routineIdx = routineIdRows[0][`${dayOfWeek}RoutineIdx`];
//     return routineIdx
// }

// async function selectRoutine(connection, routineIdx) {
//     // healthCategory 운동명 불러오기
//     const selectExerciseListQuery = `
//         SELECT healthCategoryIdx, name, time, calories, rest
//         FROM healthCategory
//     `;
//     const [exerciseList] = await connection.query(selectExerciseListQuery);

//     // routine row 긁어오기
//     const selectRoutineQuery = `
//         SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
//         FROM routine
//         WHERE routineIdx = ?
//     `;
//     const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);

//     if (!routine) return routine;

//     var routineContent = [];
//     var totalPredictTime = 0;
//     var totalPredictCalories = 0;

//     // routineDetail table에서 긁어오기
//     for (var i = 0; i < 10; i++) {
//         const selectRoutineDetailQuery = `
//             SELECT routineDetailIdx, healthCategoryIdx, rep${i}, weight${i}
//             FROM routineDetail
//             WHERE routineDetailIdx = ?
//         `;
//         const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routine['detailIdx' + String(i)]);

//         if (routineDetail) {
//             const nonNullRepValues = [routineDetail.rep0, routineDetail.rep1, routineDetail.rep2, routineDetail.rep3, routineDetail.rep4, routineDetail.rep5, routineDetail.rep6, routineDetail.rep7, routineDetail.rep8, routineDetail.rep9].filter(value => value !== null);

//             console.log(nonNullRepValues)
//             const exerciseInfo = exerciseList.find(exercise => exercise.healthCategoryIdx === routineDetail.healthCategoryIdx);

//             console.log(exerciseInfo.time)
//             const predictTime = nonNullRepValues.length * exerciseInfo.time;
//             const predictCalories = nonNullRepValues.length * routineDetail['weight' + i] * exerciseInfo.calories;

//             totalPredictTime += predictTime;
//             totalPredictCalories += predictCalories;

//             var detailContent = {
//                 'exerciseInfo': {
//                     'healthCategoryIdx': exerciseInfo.healthCategoryIdx,
//                     'exerciseName': exerciseInfo.name
//                 },
//                 'totalSets': nonNullRepValues.length,
//                 'rep': routineDetail['rep' + i],
//                 'weight': routineDetail['weight' + i] !== null ? routineDetail['weight' + i] : "null",
//                 'predictTime': Math.floor(predictTime / 60),  // Convert seconds to minutes
//                 'predictCalories': predictCalories
//             };

//             routineContent.push(detailContent);
//         }
//     }

//     return {
//         routineContent: routineContent,
//         totalDuration: Math.floor(totalPredictTime / 60),  // Convert seconds to minutes for total duration
//         totalCalories: totalPredictCalories
//     };
// }






// // 운동 전 / 세트, 무게, 횟수 (Detail) 조회
// async function selectBeforeProcessDetail(connection, routine_list) {
//     if (!routine_list || routine_list.length === 0) {
//         return [];
//     }

//     const selectBeforeProcessDetailQuery = `
//         SELECT
//             -- Count non-null data from rep0 to rep9 in routineDetail
//             SUM(
//                 CASE WHEN rep0 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep1 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep2 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep3 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep4 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep5 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep6 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep7 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep8 IS NOT NULL THEN 1 ELSE 0 END +
//                 CASE WHEN rep9 IS NOT NULL THEN 1 ELSE 0 END
//             ) AS all_set,
//             -- Select rep0 data from routineDetail
//             MAX(CASE WHEN rep0 IS NOT NULL THEN rep0 END) AS data_rep0,
//             -- Select weight0 data from routineDetail
//             MAX(CASE WHEN rep0 IS NOT NULL THEN weight0 END) AS data_weight0,
//             -- Select healthCategoryEnglishName from healthCategory
//             GROUP_CONCAT(DISTINCT healthCategory.englishName) AS healthCategoryEnglishName
//         FROM routineDetail
//         LEFT JOIN healthCategory ON routineDetail.healthCategoryIdx = healthCategory.healthCategoryIdx
//         WHERE routineDetailIdx IN (?)
//         GROUP BY routineDetailIdx
//     `;

//     const [beforeProcessDetail] = await connection.query(selectBeforeProcessDetailQuery, [routine_list]);

//     return beforeProcessDetail;
// }




// // 운동 중 / 세트, 무게, 횟수 (Detail) 조회
// async function selectProcessDetail(connection, routineIdx) {
//     const selectRoutineQuery = `
//         SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
//         FROM routine
//         WHERE routineIdx = ?
//     `;

//     const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);

//     if (!routine) return [];

//     const routine_list = [];
//     for (let i = 0; i < 10; i++) {
//         const detailIdxValue = routine[`detailIdx${i}`];
//         if (detailIdxValue !== null && detailIdxValue > 0) {
//             routine_list.push(detailIdxValue);
//         }
//     }

//     const result = [];
//     for (const routineDetailIdx of routine_list) {
//         const selectRoutineDetailQuery = `
//             SELECT rd.routineDetailIdx,
//                    GROUP_CONCAT(rd.healthCategoryIdx) AS healthCategoryIdxList,
//                    GROUP_CONCAT(hc.englishName) AS exerciseNames,
//                    rep0, rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8, rep9,
//                    weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9
//             FROM routineDetail rd
//             LEFT JOIN healthCategory hc ON rd.healthCategoryIdx = hc.healthCategoryIdx
//             WHERE rd.status = 0 AND rd.routineDetailIdx = ?
//         `;
//         const [[routineDetailRow]] = await connection.query(selectRoutineDetailQuery, routineDetailIdx);

//         if (!routineDetailRow || routineDetailRow.healthCategoryIdxList === null) {
//             result.push({
//                 routineDetailIdx: routineDetailIdx,
//                 sets: [],
//             });
//         } else {
//             const healthCategoryIdxList = routineDetailRow.healthCategoryIdxList.split(',');
//             const exerciseNames = routineDetailRow.exerciseNames.split(',');
//             const exerciseSets = [];
//             for (let i = 0; i < 10; i++) {
//                 if (routineDetailRow[`rep${i}`] === null) {
//                     break;
//                 }
//                 exerciseSets.push({
//                     set: i,
//                     rep: routineDetailRow[`rep${i}`],
//                     weight: routineDetailRow[`weight${i}`],
//                 });
//             }

//             result.push({
//                 routineDetailIdx: routineDetailRow.routineDetailIdx,
//                 exerciseDetails: healthCategoryIdxList.map((healthCategoryIdx, index) => ({
//                     healthCategoryIdx: parseInt(healthCategoryIdx),
//                     exerciseName: exerciseNames[index],
//                 })),
//                 sets: exerciseSets,
//             });
//         }
//     }

//     return result;
// }

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
        SELECT name, healthCategoryIdx, parts, muscle, equipment
        FROM healthCategory
        WHERE parts = ? AND healthCategoryIdx <> ?
        ORDER BY RAND()
        LIMIT ?;
    `;

    const [replacementExerciseRows] = await connection.query(getReplacementExercisesQuery, [exercisePart, healthCategoryIdx, maxRecommendations]);

    return replacementExerciseRows;
}

async function updateRoutineDetail(connection, routineIdx, beforeHealthCategoryIdx, afterHealthCategoryIdx) {
    const routineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?;
    `;
    const [routine_list] = await connection.query(routineQuery, routineIdx);

    const newRoutineArray = [];

    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routine_list[0][`detailIdx${i}`];

        if (detailIdxValue !== 0) {
            newRoutineArray.push(detailIdxValue);
        }
    }

    const updateBeforeHealthCategoryQuery = `
        UPDATE routineDetail
        SET healthCategoryIdx = ?
        WHERE routineDetailIdx IN (?) AND healthCategoryIdx = ?;
    `;

    await connection.query(updateBeforeHealthCategoryQuery, [afterHealthCategoryIdx, newRoutineArray, beforeHealthCategoryIdx])
}


async function updateSkipValue(connection, routineIdx, healthCategoryIdxParam) {
    const checkRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?;
    `;
    const [routine_list] = await connection.query(checkRoutineQuery, routineIdx);

    const newRoutineArray = [];

    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routine_list[0][`detailIdx${i}`];

        if (detailIdxValue !== 0) {
            newRoutineArray.push(detailIdxValue);
        }
    }
    const selectHealthCategoryName = `
        SELECT name
        FROM healthCategory
        WHERE healthCategoryIdx = ?;
    `;

    const name = await connection.query(selectHealthCategoryName, healthCategoryIdxParam)

    const selectHealthCategoryIdxQuery = `
        SELECT healthCategoryIdx
        FROM routineDetail
        WHERE routineDetailIdx = ?;
    `;

    const updateSkipValueQuery = `
        UPDATE routineDetail
        SET skip = '1'
        WHERE routineDetailIdx = ? AND healthCategoryIdx = ?;
    `;

    for (const routineDetailIdx of newRoutineArray) {
        const [result] = await connection.query(selectHealthCategoryIdxQuery, routineDetailIdx);
        if (result.length > 0) {
            const healthCategoryIdx = result[0].healthCategoryIdx;

            // Only update if healthCategoryIdx matches the parameter value
            if (healthCategoryIdx === healthCategoryIdxParam) {
                await connection.query(updateSkipValueQuery, [routineDetailIdx, healthCategoryIdx]);
            }
        }
    }

    return name[0]
}

// Insert calendar data
async function insertMyCalendar(connection, userIdx, userId, routineIdx, parsedTotalWeight, totalExerciseTime) {
    const insertMyCalendarQuery = `
    INSERT INTO myCalendar (userIdx, userId, routineIdx, totalWeight, totalExerciseTime, healthDate)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const cuurentDate = new Date()

    const insertParams = [userIdx, userId, routineIdx, parsedTotalWeight, totalExerciseTime, cuurentDate];

    const [insertRows] = await connection.query(insertMyCalendarQuery, insertParams);

    return insertRows;
}

// routineIdx 기준으로 마지막 데이터 2개 합차 조회(-1 인덱스와 -2 인덱스 차이)
async function getComparison(connection, userId, routineIdx) {
    // 마지막 두 개의 데이터 조회
    const selectLastTwoDataQuery = `
        SELECT totalExerciseTime, totalWeight, healthDate
        FROM myCalendar
        WHERE userId = ? AND routineIdx = ?
        ORDER BY healthDate DESC
        LIMIT 2;
    `;

    const [lastTwoData] = await connection.query(selectLastTwoDataQuery, [userId, routineIdx]);

    if (!lastTwoData || lastTwoData.length < 2) {
        return { exerciseTimeChange: 0, weightChange: 0 };
    }

    // 마지막 두 개 데이터의 차이를 계산합니다
    const exerciseTimeChange = lastTwoData[1].totalExerciseTime - lastTwoData[0].totalExerciseTime;
    const weightChange = lastTwoData[1].totalWeight - lastTwoData[0].totalWeight;

    console.log("exerciseTimeChange:", exerciseTimeChange)
    console.log("weightChange:", weightChange)


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

module.exports = {
    getComparison,
    getHealthCount,
    updateRoutineDetail,
    selectReplaceDetail,
    isValidUser,
    selectUserIdCheck,
    selectUserIdx,
    selectTotalWeight,
    selectRoutineIdx,
    selectDetailIdx,
    selectRoutine,
    // selectRoutineIdx,
    // selectRoutine,
    // selectBeforeProcessDetail,
    selectProcessDetail,
    getExercisePart,
    getReplacementExercisesLimited,
    updateSkipValue,
    insertMyCalendar,
};
