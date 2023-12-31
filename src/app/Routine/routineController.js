const {logger} = require("../../../config/winston");
const routineProvider = require("./routineProvider");
const routineService = require("./routineService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API Name : 루틴 생성 API
 * [POST] /app/routine
 */
exports.postRoutine = async function (req, res) {
    /**
     * Decoded : userId, isPremium
     * Body : routineCalendar
     */
    const userId = req.decoded.userId;
    const isPremium = req.decoded.isPremium;
    const info = req.body;

    const gpt = req.gpt;

    console.log("GPT START : " + Date(0).toString());
    const responsePostRoutineCalendar = await routineService.insertRoutine(userId, isPremium, info, gpt);
    console.log("GPT END : " + Date(0).toString());

    return res.send(responsePostRoutineCalendar);
};

/**
 * API Name : 루틴 등록 API
 * [POST] /app/routine/calendar
*/
exports.postRoutineCalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Body : info
     */
    const userId = req.decoded.userId;
    const routineCalendar = req.body;
    
    const responsePostRoutine = await routineService.insertRoutineCalendar(userId, routineCalendar);

    return res.send(responsePostRoutine);
};


/**
 * API Name : 루틴 일정 조회 API
 * [GET] /app/routine/calendar
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
 * API Name : 루틴 일정 수정 API
 * [PUT] /app/routine/calendar
 */
exports.putRoutineCalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Body : routineCalendar
     */
    const userId = req.decoded.userId;
    const routineCalendar = req.body;

    const responsePutRoutineCalendar = await routineService.updateRoutineCalendar(userId, routineCalendar);

    return res.send(responsePutRoutineCalendar);
};

/**
 * API Name : 루틴 부위 조회 API
 * [GET] /app/routine/calendar/parts
 */
exports.getRoutineParts = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId;

    const routineParts = await routineProvider.retrieveRoutineParts(userId);

    if (!routineParts) return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
    else return res.send(response(baseResponse.SUCCESS, routineParts));
}

/**
 * API Name : 당일 루틴 조회 API
 * [GET] /app/routine/today
 */
exports.getTodayRoutine = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId;

    const todayRoutine = await routineProvider.retrieveTodayRoutine(userId);

    if (!todayRoutine) return res.send(errResponse(baseResponse.ROUTINE_UNDEFINED));
    else return res.send(response(baseResponse.SUCCESS, todayRoutine));
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
     * Decoded : userId
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
     * Decoded : userId
     * Path Variable : routineIdx
     */
    const userId = req.decoded.userId;
    const routineIdx = req.params.routineIdx;

    const resposneDeleteRoutine = await routineService.deleteRoutine(userId, routineIdx);

    return res.send(resposneDeleteRoutine);
};

/**
 * API Name : 운동 과정 상세 내용 API
 * [GET] /app/routine/end/update
 */
exports.endProcess = async function (req, res) {
    /**
     * Decoded : userId
     */
    const userId = req.decoded.userId;
    const isPremium = req.decoded.isPremium;

    const responseEndProcess = await routineProvider.endProcess(userId, isPremium);

    if (!responseEndProcess) return res.send(errResponse(baseResponse.COMPARE_ROUTINE_UNDEFINED));
    else return res.send(response(baseResponse.SUCCESS, responseEndProcess));
};

/**
 * API Name : 지난주 운동 기록 생성 API
 * [POST] /app/routine/gen/last-process
 */
exports.genLastProcess = async function (req, res) {
    /**
     * Body : userId, date, content;
     */
    const userId = req.body.userId;
    const date = req.body.date;
    const originIdx = req.body.originRoutineIdx;
    const info = req.body.info;

    const responsePostRoutine = await routineService.insertLastProcess(userId, date, originIdx, info);

    return res.send(responsePostRoutine);
};