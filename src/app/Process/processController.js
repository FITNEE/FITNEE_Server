const {logger} = require("../../../config/winston");
const processProvider = require("./processProvider");
const processService = require("./processService")
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * 1 API Name : 운동 루틴 조회 API
 * [GET] /app/process/:routineIdx
 */


/**
 * 2 API Name : 운동별 과정 전 조회 API
 * [GET] /app/process/before/:routineIdx
 */
exports.getBeforeProcessDetail = async function (req, res) {

    /**
     * Path Variable : routineIdx
     */
    const routineIdx = req.params.routineIdx
    const beforeProcessDetail = await processProvider.retrieveBeforeProcessDetail(routineIdx)

    return res.send(response(baseResponse.SUCCESS, beforeProcessDetail))
}

/**
 * 3 API Name : 운동별 과정 중 조회 API
 * [GET] /app/process/:routineIdx
 */
exports.getProcessDetail = async function (req, res) {
    /**
     * Path Variable : routineIdx
     */
    const routineIdx = req.params.routineIdx
    const routineDetail = await processProvider.retrieveProcessDetail(routineIdx)

    return res.send(response(baseResponse.SUCCESS, routineDetail))
}

/**
 *  4-1 API Name : 운동 루틴 대체 추천 API\
 * [GET] /app/process/replace/:detailIdx
 */
exports.getReplacementRecommendations = async function (req, res) {
    /**
     * Decoded : userId
     * Path Variable : detailIdx
     */
    try {
        const { detailIdx } = req.params

        // 유효성 검증
        if (!Number.isInteger(parseInt(detailIdx)) || parseInt(detailIdx) <= 0) {
            console.log("Invaild detailIdx")
            return res.send(response(baseResponse.INVALID_DETAIL_IDX))
        }

        // 유저 담당 detailIdx 검증
        const userId = req.decoded.userId
        const isDetailIdxBelongsToUser = await processProvider.isDetailIdxBelongsToUser(userId, detailIdx) // await 추가

        if (!isDetailIdxBelongsToUser) {
            console.log("The detailIdx does not belong to the user")
            return res.send(response(baseResponse.DETAIL_IDX_NOT_BELONGS_TO_USER))
        }

        // 동일 parts
        const exercisePart = await processProvider.getExercisePart(detailIdx) // await 추가

        if (!exercisePart) {
            console.log("Exercise part unknown")
            return res.send(response(baseResponse.EXERCISE_NOT_FOUND))
        }

        // 동일 parts 내에서 랜덤 추출
        const replacementRecommendations = await processProvider.getReplacementExercises(detailIdx, exercisePart)

        if (replacementRecommendations.length === 0) {
            console.log("No replacement exercises found")
            return res.send(response(baseResponse.REPLACEMENT_EXERCISES_NOT_FOUND))
        }

        return res.send(response(baseResponse.SUCCESS, { replacementRecommendations }))
    } catch (err) {
        console.error(`App - getReplacementRecommendations Error: ${err.message}`);
        return res.status(500).send(response(baseResponse.INTERNAL_SERVER_ERROR));
    }
}

exports.saveReplacementRoutine = async function (req, res) {
    /**
     * Decoded : userId
     * Path Variable : detailIdx
     * Request Body: replacementData
     * Example of replacementData:
     * {
     *    "routineDetailIdx": 123,
     *    "reps": [10, 12],
     *    "weights": [20, 25],
     *    "skip": false
     * }
     */
    try {
        const { detailIdx } = req.params;
        const { routineDetailIdx, reps, weights, skip } = req.body;

        // 유효성 검증
        if (!Number.isInteger(parseInt(detailIdx)) || parseInt(detailIdx) <= 0) {
            console.log("Invalid detailIdx");
            return res.send(response(baseResponse.INVALID_DETAIL_IDX));
        }

        // 유저 담당 detailIdx 검증
        const userId = req.decoded.userId;
        const isDetailIdxBelongsToUser = await processProvider.isDetailIdxBelongsToUser(userId, detailIdx);

        if (!isDetailIdxBelongsToUser) {
            console.log("The detailIdx does not belong to the user");
            return res.send(response(baseResponse.DETAIL_IDX_NOT_BELONGS_TO_USER));
        }

        // routineDetail 수정
        const updatedRoutineDetail = await processProvider.updateRoutineDetail(routineDetailIdx, reps, weights, skip);

        if (!updatedRoutineDetail) {
            console.log("Failed to update routineDetail");
            return res.send(response(baseResponse.UPDATE_ROUTINE_DETAIL_FAILED));
        }

        return res.send(response(baseResponse.SUCCESS, { updatedRoutineDetail }));
    } catch (err) {
        console.error(`App - saveReplacementRoutine Error: ${err.message}`);
        return res.status(500).send(response(baseResponse.INTERNAL_SERVER_ERROR));
    }
}

/**
 * 5 API Name : 운동 루틴 '전체' 중단 API
 * [PATCH] /app/process/:routineIdx
 */
exports.patchProcess = async function (req, res) {
    /**
     * Decoded: userId
     * Path Variable : routineIdx
     * Body : status
     */
    const userId = req.decoded.userId
    const routineIdx = req.params.routineIdx
    const routineStatus = req.body
    
    const responsePatchProcess = await ProcessService.updateProcess(userId, routineIdx, routineStatus)

    return res.send(responsePatchProcess)
}

/**
 * 6 API Name : 운동 건너뛰기 API
 * [PATCH] /app/process/:routineDetailIdx
 */
exports.patchProcessDetail = async function (req, res) {
    /**
     * Decoded : userId
     * Path Variable : routineDetailIdx
     * Body : skip
     */
    const userId = req.decoded.userId
    const routineDetailIdx = req.params.routineDetailIdx
    const routineSkip = req.body

    const responsePatchProcessDetail = await processService.skipProcessDatail(userId, routineDetailIdx, routineSkip)

    return res.send(responsePatchProcessDetail)
}

/** // 물어보기
 * 7 API Name : 운동 루틴 캘린더 기록 API
 * [POST] /app/process/:routineIdx/end
 */
exports.postMyCalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Body : userIdx, routineCalendarIdx, totalExerciseTime, totalWeight, healthDate
     */
    const { userIdx, routineCalendarIdx, totalExerciseTime, totalWeight, healthDate } = req.body

    // 유효성 검증
    if (!userIdx) return res.send(errResponse)
}

/**
 * 8 API Name : 운동 결과 개요 API
 * [GET] /app/process/:routineIdx/end
 */
exports.getProcessEnd = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId

    const ProcessEnd = await processProvider.retrieveProcessEnd(userId)

    if(!ProcessEnd) return res.send(errResponse)
    else return res.send(baseResponse.SUCCESS, ProcessEnd)
}


// 관련 운동 추천 아닌가? (보류)
/**
 * 9 API Name : 운동 분석 API
 * [GET] /app/process/:routineIdx/end/detail
 */
exports.getProcessEndDetail = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId

    const ProcessEndDetail = await processProvider.retrieveProcessEndDetail(userId)

    if(!ProcessEndDetail) return res.send(errResponse)
    else return res.send(baseResponse.SUCCESS, ProcessEndDetail)
}


// /** [일단 보류, 프론트가 한다네 ㅎ]
//  * API Name : 결과 공유 API
//  * [POST] /app/process/:routineIdx/end/detail
//  */
// exports.postProcessEndDetail = async function (req, res) {
//     /**
//      * Decoded : userId
//      * Body : sharingMethod, ana
//      */
// }