const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const processDao = require("./processDao");

// Provider: Read 비즈니스 로직 처리

exports.getUserIdCheck = async function (userId, rouinteIdx, dayOfWeek) {
    const connection = await pool.getConnection(async (conn) => conn)

    const getUserIdCheck = await processDao.selectUserIdCheck(connection, userId, rouinteIdx, dayOfWeek)
    connection.release()
    return getUserIdCheck
}

exports.getUserIdx = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn)

    const userIdx = await processDao.selectUserIdx(connection, userId)
    connection.release()
    return userIdx
}

exports.getTotalWeight = async function (routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn)

    const TotalWeight = await processDao.selectTotalWeight(connection, routineIdx)

    connection.release()

    return TotalWeight
}

exports.getDetailIdx = async function (healthCategory) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    const detailIdx = await processDao.selectDetailIdx(connection, healthCategory)


    connection.release()

    return detailIdx
}

exports.getRoutineDetails = async function (dayOfWeek, userId) {
    const connection = await pool.getConnection(async (conn) => conn);


    const routineIdx = await processDao.selectRoutineIdx(connection, dayOfWeek, userId);


    const routineSummary = await processDao.selectRoutine(connection, routineIdx);

    const routineDetails = await processDao.selectProcessDetail(connection, routineIdx);

    connection.release();

    const combinedRoutineDetails = routineDetails.map(detail => {
        const exerciseInfoContent = routineSummary.routineContent.find(content => content.exerciseInfo.healthCategoryIdx === detail.exerciseDetails.healthCategoryIdx);
        

        if (!exerciseInfoContent) {
            console.error(`Exercise info not found for healthCategoryIdx: ${detail.exerciseDetails.healthCategoryIdx}`);
            return null;
        }
    
        const exerciseInfo = exerciseInfoContent.exerciseInfo;

    
        const nonNullSets = detail.sets.filter(set => set.rep !== null && set.rep !== 0);
    
        return {
            exerciseInfo: {
                healthCategoryIdx: exerciseInfo.healthCategoryIdx,
                exerciseName: exerciseInfo.exerciseName,
            },
            replace: detail.replace,
            totalSets: nonNullSets.length,
            rep: detail.sets[0].rep,
            weight: detail.sets[0].weight,
            predictTime: detail.predictTime,
            predictCalories: detail.predictCalories,
            rest: detail.rest,
            sets: nonNullSets.map(set => ({
                set: set.set,
                rep: set.rep,
                weight: set.weight,
            })),
        };
    }).filter(detail => detail !== null);


    const totalPredictTime = combinedRoutineDetails.reduce((total, detail) => total + detail.predictTime, 0);
    const totalPredictCalories = combinedRoutineDetails.reduce((total, detail) => total + detail.predictCalories, 0);

    return {
        dayOfWeek: dayOfWeek,
        routineIdx: routineIdx,
        routineDetails: combinedRoutineDetails,
        totalDuration: Math.floor(totalPredictTime / 60),
        totalCalories: totalPredictCalories,
    };
};

// // 루틴 조회
// exports.retrieveRoutine = async function (dayOfWeek, userId) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const routineIdx = await processDao.selectRoutineIdx(connection, dayOfWeek, userId);

//     const routine = await processDao.selectRoutine(connection, routineIdx)

//     // const routineDetail = await processDao.selectProcessDetail(connection, routineDetailIdx);

//     connection.release();

//     return routine;
// };

// // 오늘 루틴 리스트 뽑아오기
// exports.retrieveRoutineRow = async function (routineIdx) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const [routineRow] = await connection.query(
//         'SELECT * FROM routine WHERE routineIdx = ?',
//         [routineIdx]
//       );
//       connection.release();
//       return routineRow[0] || null;
// };

// // before 운동 /  세트, 무게, 횟수
// exports.retrieveBeforeProcessDetail = async function (routineIdx) {
//     // Fetch the routine row based on routineIdx
//     const routineRow = await this.retrieveRoutineRow(routineIdx);


//     if (!routineRow) {
//         return null;
//     }

//     // Create an array to store non-null and greater than 0 values from detailIdx0 to detailIdx9
//     const routine_list = [];

//     // Loop through detailIdx0 to detailIdx9 and store non-null and greater than 0 values in routine_list
//     for (let i = 0; i < 10; i++) {
//         const detailIdxValue = routineRow[`detailIdx${i}`];
//         if (detailIdxValue !== null && detailIdxValue > 0) {
//             routine_list.push(detailIdxValue);
//         }
//     }

//     const connection = await pool.getConnection(async (conn) => conn);
//     // Use routine_list to query the 'routineDetail' table
//     const beforeProcessDetail = await processDao.selectBeforeProcessDetail(connection, routine_list);


//     return beforeProcessDetail;
// };

// // 운동 중 / 세트, 무게, 횟수
// exports.retrieveProcessDetail = async function (routineIdx) {
//     const connection = await pool.getConnection(async (conn) => conn);
//     const routineDetail = await processDao.selectProcessDetail(connection, routineIdx);
//     connection.release();

//     return routineDetail;
// }

// userId 매치 검증
exports.isDetailIdxBelongsToUser = async function (userId, detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn)
    const result = await processDao.checkDetailIdx(connection, userId, detailIdx);
    connection.release()

    return result;
};

// 대체 운동 get
exports.getReplacementExercises = async function (healthCategory) {
    const connection = await pool.getConnection(async (conn) => conn)

    const maxRecommendations = 3;
    const replacementRecommendations = await processDao.getReplacementExercisesLimited(connection, healthCategory, maxRecommendations);
    connection.release()

    return replacementRecommendations;

};

// 대체한 운동의 healthCategoryIdx로 routineDetail 수정
exports.updateHealthCategoryInRoutineDetail = async function (selectedHealthCategoryIdx, routineDetailIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // routineDetail 수정
        await processDao.updateRoutineDetail(connection, selectedHealthCategoryIdx, routineDetailIdx);

        // 대체한 운동의 status를 1로 업데이트
        await processDao.updateRoutineStatus(connection, routineDetailIdx);

        connection.release();
    } catch (err) {
        throw err;
    }
};

// exports.saveTime = async function (userId, routineDetailIdx, timeInMinutes) {
//     const connection = await pool.getConnection(async (conn) => conn)
//     try {
//         const saveTimeResult = await processDao.saveTime(connection, userId, routineDetailIdx, timeInMinutes);

//         connection.release()
//         return saveTimeResult;
//     } catch (err) {
//         throw err;
//     }
// };