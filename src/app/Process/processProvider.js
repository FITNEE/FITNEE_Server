const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const processDao = require("./processDao");

// Provider: Read 비즈니스 로직 처리

exports.validateUser = async function (userId, routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const isValidUserCheck = await processDao.isValidUser(connection, userId, routineIdx)
    connection.release()
    return isValidUserCheck
}


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


    // routineIdx 조회
    const routineIdx = await processDao.selectRoutineIdx(connection, dayOfWeek, userId);

    // routine List 조회
    const routineSummary = await processDao.selectRoutine(connection, routineIdx);

    // 운동별 세부사항 조회
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
                parts: exerciseInfo.parts,
                muscle: exerciseInfo.muscle,
                equipment: exerciseInfo.equipment,
                caution: exerciseInfo.caution
            },
            skip: detail.skip,
            totalSets: nonNullSets.length,
            rep: detail.sets[0].rep,
            weight: detail.sets[0].weight,
            predictTime: detail.predictTime,
            predictCalories: detail.predictCalories,
            exerciseWeight: detail.exerciseWeight,
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
    const totalWeight = combinedRoutineDetails.reduce((total, detail) => total + detail.exerciseWeight, 0);

    return {
        dayOfWeek: dayOfWeek,
        routineIdx: routineIdx,
        routineDetails: combinedRoutineDetails,
        totalTime: totalPredictTime,
        totalCalories: totalPredictCalories,
        totalWeight: totalWeight,
    };
};

// 무게, 횟수 증감 조회
exports.getComparison = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn)
    const comparison = await processDao.getComparison(connection, userId)
    connection.release()

    return comparison
}

// userId 매치 검증
exports.isDetailIdxBelongsToUser = async function (userId, detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn)
    const result = await processDao.checkDetailIdx(connection, userId, detailIdx);
    connection.release()

    return result;
};

// 대체 운동 get
exports.getReplacementExercises = async function (healthCategoryIdx) {
    const connection = await pool.getConnection(async (conn) => conn)

    // 랜덤 3개(최대) 데이터 뽑아오기
    const maxRecommendations = 3;
    const replacementRecommendations = await processDao.getReplacementExercisesLimited(connection, healthCategoryIdx, maxRecommendations);


    connection.release()

    return replacementRecommendations;

};

// 대체한 운동의 healthCategoryIdx로 routineDetail 수정
exports.updateHealthCategoryInRoutineDetail = async function (routineIdx, beforeHealthCategoryIdx, afterHealthCategoryIdx) {

    const connection = await pool.getConnection(async (conn) => conn);

    // beforeHealthCategoryIdx -> afterHealthCategoryIdx 수정
    await processDao.updateRoutineDetail(connection, routineIdx, beforeHealthCategoryIdx, afterHealthCategoryIdx);

    connection.release();

};

// 운동횟수
exports.getHealthCount = async function (userId) {

    const connection = await pool.getConnection(async (conn) => conn)

    const HealthCount = await processDao.getHealthCount(connection, userId)

    connection.release()
    return HealthCount
}