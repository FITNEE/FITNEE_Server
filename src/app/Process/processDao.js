const lodash = require('lodash');

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
    for (var i = 0; i < 10; i++) {
        const selectRoutineDetailQuery = `
            SELECT healthCategoryIdx, rep0, weight0, rep1, weight1, rep2, weight2, rep3, weight3, rep4, weight4, rep5, weight5, rep6, weight6, rep7, weight7, rep8, weight8, rep9, weight9
            FROM routineDetail
            WHERE routineDetailIdx = ?
        `;
        const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routine['detailIdx' + String(i)]);

        var routineDetailPickBy = lodash.pickBy(routineDetail);
        var detailContent = {};

        if (routineDetail) {
            var len = Object.keys(routineDetailPickBy).length - 1;
            var detailItem = [];
            var allNull = true;

            for (var j = 0; j < len; j++) {
                var rep = routineDetail['rep' + String(j)];
                var weight = routineDetail['weight' + String(j)];

                if (rep !== null || weight !== null) {
                    allNull = false;
                }

                if (rep === null && weight === null) {
                    break;
                }

                var weightValue = weight !== null ? weight : "null";
                detailItem.push({
                    'rep': rep,
                    'weight': weightValue
                });
            }

            if (!allNull && detailItem.length > 0) {
                detailContent['healthCategoryIdx'] = routineDetail.healthCategoryIdx;
                detailContent['exerciseName'] = exerciseList[routineDetail.healthCategoryIdx - 1].name;
                detailContent['content'] = detailItem;
                routineContent.push(detailContent);
            }
        }
    }

    return routineContent;
}


// 운동 전 / 세트, 무게, 횟수 (Detail) 조회
async function selectBeforeProcessDetail(connection, routine_list) {
    if (!routine_list || routine_list.length === 0) {
        return [];
    }

    const selectBeforeProcessDetailQuery = `
        SELECT
            -- Count non-null data from rep0 to rep9 in routineDetail
            SUM(
                CASE WHEN rep0 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep1 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep2 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep3 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep4 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep5 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep6 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep7 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep8 IS NOT NULL THEN 1 ELSE 0 END +
                CASE WHEN rep9 IS NOT NULL THEN 1 ELSE 0 END
            ) AS all_set,
            -- Select rep0 data from routineDetail
            MAX(CASE WHEN rep0 IS NOT NULL THEN rep0 END) AS data_rep0,
            -- Select weight0 data from routineDetail
            MAX(CASE WHEN rep0 IS NOT NULL THEN weight0 END) AS data_weight0,
            -- Select healthCategoryEnglishName from healthCategory
            GROUP_CONCAT(DISTINCT healthCategory.englishName) AS healthCategoryEnglishName
        FROM routineDetail
        LEFT JOIN healthCategory ON routineDetail.healthCategoryIdx = healthCategory.healthCategoryIdx
        WHERE routineDetailIdx IN (?)
        GROUP BY routineDetailIdx
    `;

    const [beforeProcessDetail] = await connection.query(selectBeforeProcessDetailQuery, [routine_list]);

    return beforeProcessDetail;
}




// 운동 중 / 세트, 무게, 횟수 (Detail) 조회
async function selectProcessDetail(connection, routineIdx) {
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE routineIdx = ?
    `;

    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);

    if (!routine) return [];

    const routine_list = [];
    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routine[`detailIdx${i}`];
        if (detailIdxValue !== null && detailIdxValue > 0) {
            routine_list.push(detailIdxValue);
        }
    }

    const result = [];
    for (const routineDetailIdx of routine_list) {
        const selectRoutineDetailQuery = `
            SELECT rd.routineDetailIdx,
                   GROUP_CONCAT(rd.healthCategoryIdx) AS healthCategoryIdxList,
                   GROUP_CONCAT(hc.englishName) AS exerciseNames,
                   rep0, rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8, rep9,
                   weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9
            FROM routineDetail rd
            LEFT JOIN healthCategory hc ON rd.healthCategoryIdx = hc.healthCategoryIdx
            WHERE rd.status = 0 AND rd.routineDetailIdx = ?
        `;
        const [[routineDetailRow]] = await connection.query(selectRoutineDetailQuery, routineDetailIdx);

        if (!routineDetailRow || routineDetailRow.healthCategoryIdxList === null) {
            result.push({
                routineDetailIdx: routineDetailIdx,
                sets: [],
            });
        } else {
            const healthCategoryIdxList = routineDetailRow.healthCategoryIdxList.split(',');
            const exerciseNames = routineDetailRow.exerciseNames.split(',');
            const exerciseSets = [];
            for (let i = 0; i < 10; i++) {
                if (routineDetailRow[`rep${i}`] === null) {
                    break;
                }
                exerciseSets.push({
                    set: i,
                    rep: routineDetailRow[`rep${i}`],
                    weight: routineDetailRow[`weight${i}`],
                });
            }

            result.push({
                routineDetailIdx: routineDetailRow.routineDetailIdx,
                exerciseDetails: healthCategoryIdxList.map((healthCategoryIdx, index) => ({
                    healthCategoryIdx: parseInt(healthCategoryIdx),
                    exerciseName: exerciseNames[index],
                })),
                sets: exerciseSets,
            });
        }
    }

    return result;
}

// 운동별 parts get
async function getExercisePart(connection, detailIdx) {

    const getExercisePartQuery = `
        SELECT parts
        FROM healthCategory
        WHERE healthCategoryIdx = (
            SELECT healthCategoryIdx
            FROM routineDetail
            WHERE routineDetailIdx = ?
        )
    `;
    const [exercisePartRows] = await connection.query(getExercisePartQuery, [detailIdx]);

    if (exercisePartRows.length === 0) {
        console.log("")
        return null;
    }

    return exercisePartRows[0].parts;
};

// routineCalendar에서 오늘 운동을 위한 routineIdx 추출
async function getTodayRoutineIdx (userId, dayOfWeek) {
    const getRoutineIdxQuery = `
        SELECT ${dayOfWeek}RoutineIdx AS routineIdx
        FROM routineCalendar
        WHERE userId = ?
    `;
    const [rows] = await connection.query(getRoutineIdxQuery, [userId]);
    return rows[0].routineIdx;
}

// Check if the detailIdx belongs to the user
async function checkDetailIdx (connection, userId, detailIdx) {

    const checkDetailIdxQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM routine
            WHERE routineIdx IN (
                SELECT routineIdx
                FROM routineCalendar
                WHERE userId = ?
            ) AND (detailIdx0 = ? OR detailIdx1 = ? OR detailIdx2 = ? OR detailIdx3 = ? OR detailIdx4 = ? OR detailIdx5 = ? OR detailIdx6 = ? OR detailIdx7 = ? OR detailIdx8 = ? OR detailIdx9 = ?)
        ) AS exist;
    `;

    const [rows] = await connection.query(checkDetailIdxQuery, [userId, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx, detailIdx]);
    return rows[0].exist === 1;
}

// 랜덤추천
async function getReplacementExercisesLimited(connection, detailIdx, exercisePart, maxRecommendations) {

    // 현재 바꾸려는 운동 제외해서 대체 운동 추천
    const getReplacementExercisesQuery = `
        SELECT healthCategoryIdx
        FROM healthCategory
        WHERE parts = ?
        AND healthCategoryIdx <> ?
        ORDER BY RAND()
        LIMIT ?;
    `;

    const [replacementExerciseRows] = await connection.query(getReplacementExercisesQuery, [exercisePart, detailIdx, maxRecommendations]);
    const replacementRecommendations = replacementExerciseRows.map((row) => row.healthCategoryIdx);

    return replacementRecommendations;
};

// 대체 추천 이전의 healthCategoryIdx 추출
async function updateRoutineDetail(connection, selectedHealthCategoryIdx, routineDetailIdx) {
    const updateRoutineDetailQuery = `
        UPDATE routineDetail
        SET healthCategoryIdx = ?
        WHERE routineDetailIdx = ?;
    `;
    await connection.query(updateRoutineDetailQuery, [selectedHealthCategoryIdx, routineDetailIdx]);
};


// routine table()및 routineDetail table(healthCategoryIdx) 수정
async function updateRoutineStatus(connection, routineDetailIdx) {
    const updateRoutineStatusQuery = `
        UPDATE routine
        SET status = 1
        WHERE routineIdx = (
            SELECT routineIdx
            FROM routineDetail
            WHERE routineDetailIdx = ?
        );
    `;
    await connection.query(updateRoutineStatusQuery, [routineDetailIdx]);
};


// skip
async function updateSkipValue(connection, routineDetailIdx) {
    const updateSkipValueQuery = `
            UPDATE routineDetail
            SET skip = '1'
            WHERE routineDetailIdx = ?;
        `;
    await connection.query(updateSkipValueQuery, [routineDetailIdx]);
}

// // time
// async function saveTime(connection, userId, routineDetailIdx, timeInMinutes) {

//         // 시간 데이터 저장
//         const insertTimeQuery = `
//             INSERT INTO timeTable (routineDetailIdx, timeInMinutes)
//             VALUES (?, ?);
//         `;
//         const [timeResult] = await connection.query(insertTimeQuery, [routineDetailIdx, timeInMinutes]);

//         if (timeResult.affectedRows === 1) {
//             // myCalendar 테이블에 시간 데이터 추가
//             const insertCalendarQuery = `
//                 INSERT INTO myCalendar (userIdx, userId, routineIdx, totalExerciseTime, healthDate)
//                 VALUES (?, ?, ?, ?, NOW());
//             `;
//             await connection.query(insertCalendarQuery, [userId, userId, routineDetailIdx, timeInMinutes]);

//             // detailIdx가 0이 아닌 경우 루틴 캘린더에 저장하는 로직 추가
//             if (routineDetailIdx !== 0) {
//                 const updateRoutineCalendarQuery = `
//                     UPDATE routineCalendar
//                     SET totalExerciseTime = totalExerciseTime + ?
//                     WHERE userId = ? AND routineIdx = ?;
//                 `;
//                 await connection.query(updateRoutineCalendarQuery, [timeInMinutes, userId, routineDetailIdx]);
//             }
//         }

//         return true;
// }

module.exports = {
    selectRoutine,
    selectBeforeProcessDetail,
    selectProcessDetail,
    getExercisePart,
    getTodayRoutineIdx,
    checkDetailIdx,
    getReplacementExercisesLimited,
    updateRoutineDetail,
    updateRoutineStatus,
    updateSkipValue,
    // saveTime,
};
