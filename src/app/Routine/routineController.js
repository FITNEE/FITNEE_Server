const {logger} = require("../../../config/winston");
const routineProvider = require("./routineProvider");
const routineService = require("./routineService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API Name : 루틴 등록 API
 * [POST] /app/routine
 */

/**
 * API Name : 루틴 조회 API
 * [GET] /app/routine
 */
exports.getRoutine = async function (req, res) {

    /**
     * Query String: userID
     */
    const userId = req.query.userId;

    if (!userId) {
        // 쿼리 미존재
    } else {
        const myRoutines = await routineProvider.retrieveMyRoutines(userId);
        return res.send(response(baseResponse.SUCCESS, myRoutines))
    }
}

/**
 * API Name : 마이 루틴 조회 API
 * [GET] /app/my_routine
 */
exports.getMyRoutines = async function (req, res) {

    /**
     * Query String: userID
     */
    const userId = req.query.userId;

    if (!userId) {
        // 쿼리 미존재
    } else {
        const myRoutines = await routineProvider.retrieveMyRoutines(userId);
        return res.send(response(baseResponse.SUCCESS, myRoutines))
    }
}

/**
 * API Name : 루틴 수정 API
 * [PUT] /app/routine
 */

/**
 * API Name : 루틴 삭제 API
 * [DELETE] /app/routine
 */