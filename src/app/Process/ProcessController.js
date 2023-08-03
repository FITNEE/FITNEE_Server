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
     * Path Variable : routineDetailIdx
     */
    const routineIdx = req.params.routineIdx
    const routineDetail = await processProvider.retrieveProcessDetail(routineIdx)

    return res.send(response(baseResponse.SUCCESS, routineDetail))
}

/**
 * 3 API Name : 운동 루틴 대체 API
 * [PATCH] /app/process/samePart/:routineIdx
 */
exports.patchSamePartProcess = async function (req, res) {
    /**
     * Decoded: userId
     * Path Variable : routineIdx
     * Body : routineDetailIdx
     */
    const userId = req.decoded.userId
    const routineIdx = req.params.routineIdx
    const routineDetailIdx = req.body

    const responsePatchSamePartProcess = await processService.updateSamePart(userId, routineIdx, routineDetailIdx)

    return res.send(responsePatchSamePartProcess)
}

/**
 * 4 API Name : 운동 루틴 '전체' 중단 API
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
 * API Name : 운동 건너뛰기 API
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
 * API Name : 운동 루틴 캘린더 기록 API
 * [POST] /app/process/:routineIdx/end
 */
exports.postCalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Body : userIdx, routineCalendarIdx, totalExerciseTime, totalWeight, healthDate
     */
    const { userIdx, routineCalendarIdx, totalExerciseTime, totalWeight, healthDate } = req.body

    // 유효성 검증
    if (!userIdx) return res.send(errResponse)
}

/**
 * API Name : 운동 결과 개요 API
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
 * API Name : 운동 분석 API
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

/**
 * API Name : 결과 공유 API
 * [POST] /app/process/:routineIdx/end/detail
 */
exports.postProcessEndDetail = async function (req, res) {
    /**
     * Decoded : userId
     * Body : sharingMethod, ana
     */
}