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
 * API Name : 루틴 일정 조회 API
 * [GET] /app/routines
 */
exports.getRoutineCalendar = async function (req, res) {
    /**
     * Query Parameters : userId
     */
    const userId = req.query.userId;

    if  (!userId) {
        return res.send(errResponse(baseResponse.QUREY_PARAMETER_WRONG));
    } else {
        const routineCalendar = await routineProvider.retrieveRoutineCalendar(userId);

        if (!routineCalendar) return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
        else return res.send(response(baseResponse.SUCCESS, routineCalendar));
    }
};

/**
 * API Name : 루틴 조회 API
 * [GET] /app/routine/:routineIdx
 */
exports.getRoutine = async function (req, res) {
    /**
     * Path Variable : routineIdx
     */
    const routineIdx = req.params.routineIdx;
    const routine = await routineProvider.retrieveRoutine(routineIdx);

    if (!routine) return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
    else return res.send(response(baseResponse.SUCCESS, routine));
};

/**
 * API Name : 루틴 수정 API
 * [PUT] /app/routine/:routineIdx
 */
exports.putRoutine = async function (req, res) {
    /**
     * Path Variable : routineIdx
     * Body : userId, weekNum, routine
     */
    const routineIdx = req.params.routineIdx;
    const userId = req.body.userId;
    const weekNum = req.body.weekNum;
    const routineContent = req.body.routine;

    const responsePutRoutine = await routineService.putRoutine(userId, weekNum, routineIdx, routineContent);

    return res.send(responsePutRoutine);
};

/**
 * API Name : 루틴 삭제 API
 * [DELETE] /app/routine/:routineIdx
 */
exports.deleteRoutine = async function (req, res) {
    /**
     * Path Variable : routineIdx
     * Body : userId, weekNum
     */
    const routineIdx = req.params.routineIdx;
    const userId = req.body.userId;
    const weekNum = req.body.weekNum;

    const resposneDeleteRoutine = await routineService.deleteRoutine(userId, weekNum, routineIdx);

    return res.send(resposneDeleteRoutine);
};