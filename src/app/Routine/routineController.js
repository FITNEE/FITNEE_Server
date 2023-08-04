const {logger} = require("../../../config/winston");
const routineProvider = require("./routineProvider");
const routineService = require("./routineService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API Name : 루틴 등록 API
 * [POST] /app/routine
 */
exports.postRoutine = async function (req, res) {
    /**
     * Decoded : userId
     * Body : info
     */
    const userId = req.decoded.userId;
    const info = req.body;
    
    const gpt = req.gpt;

    const responsePostRoutine = await routineService.insertRoutine(userId, info, gpt);

    return res.send(responsePostRoutine);
};


/**
 * API Name : 루틴 일정 조회 API
 * [GET] /app/routine
 */
exports.getRoutineCalendar = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId;

    const routineCalendar = await routineProvider.retrieveRoutineCalendar(userId);

    if (!routineCalendar) return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
    else return res.send(response(baseResponse.SUCCESS, routineCalendar));
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

    return res.send(response(baseResponse.SUCCESS, routine));
};

/**
 * API Name : 루틴 수정 API
 * [PUT] /app/routine/:routineIdx
 */
exports.putRoutine = async function (req, res) {
    /**
     * Decoded: userId
     * Path Variable : routineIdx
     * Body : routine
     */
    const userId = req.decoded.userId;
    const routineIdx = req.params.routineIdx;
    const routineContent = req.body;

    const responsePutRoutine = await routineService.updateRoutine(userId, routineIdx, routineContent);

    return res.send(responsePutRoutine);
};

/**
 * API Name : 루틴 삭제 API
 * [DELETE] /app/routine/:routineIdx
 */
exports.deleteRoutine = async function (req, res) {
    /**
     * Decoded: userId
     * Path Variable : routineIdx
     */
    const userId = req.body.userId;
    const routineIdx = req.params.routineIdx;

    const resposneDeleteRoutine = await routineService.deleteRoutine(userId, routineIdx);

    return res.send(resposneDeleteRoutine);
};