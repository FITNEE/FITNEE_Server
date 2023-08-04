const lodash = require('lodash');

// 운동 전 / 세트, 무게, 횟수 (Detail) 조회
async function selectBeforeProcessDetail(connection, routine_list) {
    if (!routine_list || routine_list.length === 0) {
        return [];
      }

      const selectBeforeProcessDetailQuery = `
        SELECT
          routineDetailIdx,
          -- Count non-null data from rep0 to rep9 in routineDetail
          SUM(CASE WHEN rep0 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep1 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep2 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep3 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep4 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep5 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep6 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep7 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep8 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep9 IS NOT NULL THEN 1 ELSE 0 END) AS total_not_null_count,
          -- Select rep0 data from routineDetail
          MAX(CASE WHEN rep0 IS NOT NULL THEN rep0 END) AS data_rep0,
          -- Select weight0 data from routineDetail
          MAX(CASE WHEN rep0 IS NOT NULL THEN weight0 END) AS data_weight0
        FROM routineDetail 
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
        WHERE status = 0 AND routineIdx = ?
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
            SELECT routineDetailIdx, rep0, rep1, rep2, rep3, rep4, rep5, rep6, rep7, rep8, rep9,
                   weight0, weight1, weight2, weight3, weight4, weight5, weight6, weight7, weight8, weight9
            FROM routineDetail
            WHERE status = 0 AND routineDetailIdx = ?;
        `;
        const [routineDetailRows] = await connection.query(selectRoutineDetailQuery, routineDetailIdx);

        if (routineDetailRows.length === 0) {
            continue; // Skip to the next iteration if routineDetailRows is empty
        }

        const exerciseSets = [];
        let setCounter = 0; // Initialize the set counter here
        for (let i = 0; i < 10; i++) {
            const repValue = routineDetailRows[0][`rep${i}`];
            if (repValue === null) {
                break; // Break the loop if rep is null
            }
            exerciseSets.push({
                set: setCounter++, // Increment the set number for non-null rep
                rep: repValue,
                weight: routineDetailRows[0][`weight${i}`], // Get the corresponding weight value
            });
        }

        result.push({
            routineDetailIdx: routineDetailRows[0].routineDetailIdx,
            sets: exerciseSets,
        });
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


module.exports = {
    selectBeforeProcessDetail,
    selectProcessDetail,
    getExercisePart,
    getTodayRoutineIdx,
    checkDetailIdx,
    getReplacementExercisesLimited,
    updateRoutineDetail,
    updateRoutineStatus,
};
