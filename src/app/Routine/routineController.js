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

exports.getRoutines = async function (req, res) {

    /**
     * Query String: userId
     */
    const userId = req.query.userId;

    if (!userId) {
        return res.send(errResponse(QUREY_PARAMETER_WRONG));
    } else {
        const routines = await routineProvider.retrieveRoutines(userId);
        if (!routines) {
            return res.send(errResponse(QUREY_PARAMETER_WRONG));
        } else {
            return res.send(response(baseResponse.SUCCESS, routines));
        }
    }
}

exports.getRoutineCurri = async function (req, res) {

    /**
     * Query String: curriIdx
     */
    const curriIdx = req.query.curriIdx;

    if (!curriIdx) {
        return res.send(errResponse(QUREY_PARAMETER_WRONG));
    } else {
        const routineCurri = await routineProvider.retrieveRoutineCurri(curriIdx);
        return res.send(response(baseResponse.SUCCESS, routineCurri))
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