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
 * API Name : 마이 루틴 조회 API
 * [GET] /app/routines
 */

exports.getRoutineCalendar = async function (req, res) {

    /**
     * Query String: userId
     */
    const userId = req.query.userId;

    if (!userId) {
        return res.send(errResponse(QUREY_PARAMETER_WRONG));
    } else {
        const routineCalendar = await routineProvider.retrieveRoutineCalendar(userId);
        if (!routineCalendar) {
            return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
        } else {
            return res.send(response(baseResponse.SUCCESS, routineCalendar));
        }
    }
}

exports.getRoutine = async function (req, res) {

    /**
     * Query String: routineIdx
     */
    const routineIdx = req.query.routineIdx;

    if (!routineIdx) {
        return res.send(errResponse(QUREY_PARAMETER_WRONG));
    } else {
        const routine = await routineProvider.retrieveRoutine(routineIdx);
        return res.send(response(baseResponse.SUCCESS, routine))
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