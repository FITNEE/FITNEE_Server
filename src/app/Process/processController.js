const {logger} = require("../../../config/winston");
const processProvider = require("./processProvider");
const processService = require("./processService")
const processController = require("./processController")
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * 1 API Name : 운동 루틴 조회 API
 * [GET] /app/process
 */
exports.getProcess = async function (req, res) {
    /**
     * Query Parameter : dayOfWeek
     */

    // 날짜 및 아이디
    const { dayOfWeek } = req.query;
    const userId = req.decoded.userId
    const routine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    return res.send(response(baseResponse.SUCCESS, routine));
};

/**
 *  2 API Name : 운동 루틴 대체 추천 API
 * [GET] /app/process/replace/:routineIdx
 */
exports.getReplacementRecommendations = async function (req, res) {
    /**
     * Path Variable : routineIdx
     * Query Parameter : healthCateogryIdx
     */
        
    const routineIdx = req.params.routineIdx
    const healthCategoryIdx = req.query.healthCategoryIdx


    // 동일 parts 내에서 랜덤 추출
    const replacementRecommendations = await processProvider.getReplacementExercises(healthCategoryIdx)

    if (replacementRecommendations.length === 0) {
        console.log("No replacement exercises found")
        return res.send(response(baseResponse.REPLACEMENT_EXERCISES_NOT_FOUND))
    }

    return res.send(response(baseResponse.SUCCESS, { replacementRecommendations }))

}


/**
 *  3 API 이름 : 대체된 운동 정보 업데이트 API
 * [Patch] /app/process/replace/:routineIdx
 */
exports.patchReplaceExerciseInRoutine = async function (req, res) {
    /**
     * Decoded : userId
     * Path Variable : routineIdx
     * Body : afterHealthCategoryIdx, beforeHealthCategoryIdx
     */
    
    const routineIdx = req.params.routineIdx
    const beforeHealthCategoryIdx = req.body.beforeHealthCategoryIdx
    const afterHealthCategoryIdx = req.body.afterHealthCategoryIdx
    const userId = req.decoded.userId

    // 1. 회원과 요청된 데이터 검증
    const isValidUser = await processProvider.validateUser(userId, routineIdx);
    if (!isValidUser) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    }

    // 유효성 검증
    if (!Number.isInteger(parseInt(beforeHealthCategoryIdx)) || parseInt(beforeHealthCategoryIdx) <= 0) {
        return res.send(response(baseResponse.INVALID_ROUTINE_IDX));
    }

    await processProvider.updateHealthCategoryInRoutineDetail(routineIdx, beforeHealthCategoryIdx, afterHealthCategoryIdx, userId)

    return res.send(response(baseResponse.SUCCESS));
};

/**
 * 4 API Name : 운동 건너뛰기 API
 * [PATCH] /app/process/:routineIdx
 */
exports.skipExercise = async function (req, res) {
    /**
     * Decoded : userId
     * Path : routineIdx
     * Body : healthCategoryIdx
     */
    const healthCategoryIdxParam = req.body.healthCategoryIdx
    const routineIdx = req.params.routineIdx
    const userId = req.decoded.userId

    // 1. 회원과 요청된 데이터 검증
    const isValidUser = await processProvider.validateUser(userId, routineIdx);
    if (!isValidUser) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    }


    // 운동 건너뛰기 (skip 값을 1로 업데이트)
    const skipExercise = await processService.updateSkipValue(routineIdx, healthCategoryIdxParam);

    return res.send(response(baseResponse.SUCCESS, skipExercise));
};

/**
 * 5 API Name : myCalendar 추가 API
 * [POST] /app/process/end/:routineIdx
 */
exports.postMycalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Path : routineIdx
     * Body : totalExerciseTime
     */
    // 시간은 초 단위로 받기
    const routineIdx = req.params.routineIdx
    const userId = req.decoded.userId
    const totalExerciseTime = req.body.totalExerciseTime

    // 추가 정보
    const userIdx = await processProvider.getUserIdx(userId)
    const totalWeight = await processProvider.getTotalWeight(routineIdx)
    const parsedTotalWeight = parseInt(totalWeight[0].totalWeight);


    const isValidUser = await processProvider.validateUser(userId, routineIdx);
    if (!isValidUser) {
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    }

    const postMyCalendar = await processService.postMyCalendar(userIdx, userId, routineIdx, parsedTotalWeight, totalExerciseTime)

    return res.send(response(baseResponse.SUCCESS, postMyCalendar))
}

/**
 * 6 API Name : 결과 조회 API
 * [GET] /app/process/end/:routineIdx
 */
exports.getProcessResult = async function (req, res) {
    /**
     * Decoded : userId
     * Query : dayOfWeek
     * Path Variable : routineIdx
     */
    const dayOfWeek = req.query.dayOfWeek
    const userId = req.decoded.userId
    const rouinteIdx = req.params.routineIdx

    // 오늘 날짜 정보 가져오기
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
    const day = currentDate.getDate();

    // 대체 및 스킵된 데이터 다시 불러오기
    const updateRoutine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    // 무게, 시간 차이 조회
    const getComparison = await processProvider.getComparison(userId, rouinteIdx)

    // 운동 횟수 조회
    const countHealth = await processProvider.getHealthCount(userId)

    return res.send(response(baseResponse.SUCCESS, {
        updateRoutine: updateRoutine,
        getComparison: getComparison,
        countHealth: countHealth,
        currentDate: {
            year: year,
            month: month,
            day: day,
        },
    }))
}



// // 관련 운동 추천 아닌가? (보류)
// /**
//  * 9 API Name : 운동 분석 API
//  * [GET] /app/process/:routineIdx/end/detail
//  */
// exports.getProcessEndDetail = async function (req, res) {
//     /**
//      * Decoded : userId
//      */
//     const userId = req.decoded.userId

//     const ProcessEndDetail = await processProvider.retrieveProcessEndDetail(userId)

//     if(!ProcessEndDetail) return res.send(errResponse)
//     else return res.send(baseResponse.SUCCESS, ProcessEndDetail)
// }