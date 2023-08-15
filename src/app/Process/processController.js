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

    // dayOfWeek 유효성 검증
    if (!['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(dayOfWeek)) {
        return res.status(400).send(response(baseResponse.INVALID_DAY_OF_WEEK, 'Invalid dayOfWeek'));
    }
    
    // 해당 요일에 루틴이 존재하는지 체크
    const checkRoutineIdx = await processProvider.getCheckRoutineCalendar(dayOfWeek, userId)
    if(checkRoutineIdx === 0) return res.send(response(baseResponse.PROCESS_DAYOFWEEK_NOT_EXIST))


    const routine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    return res.send(response(baseResponse.SUCCESS, {
        dayOfWeek: routine.dayOfWeek,
        routineIdx: routine.routineIdx,
        routineDetails: routine.routineDetails,
        totalTime: routine.totalTime,
        totalCalories: routine.totalCalories,
        totalWeight: routine.totalWeight,
        totalDist: routine.totalDist
    }));
};

/**
 *  2 API Name : 운동 루틴 대체 추천 API
 * [GET] /app/process/replace
 */
// TODO : 운동 주의사항도 반환해주기
exports.getReplacementRecommendations = async function (req, res) {
    /**
     * Query Parameter : healthCateogryIdx
     */
        
    const healthCategoryIdx = req.query.healthCategoryIdx


    // 동일 parts 내에서 랜덤 추출
    const replacementRecommendations = await processProvider.getReplacementExercises(healthCategoryIdx)
    if (replacementRecommendations.length === 0) return res.send(response(baseResponse.PROCESS_REPLACEMENT_NOT_EXIST))

    const processedRows = replacementRecommendations.map(row => ({
        name: row.name,
        healthCategoryIdx: row.healthCategoryIdx,
        parts: row.parts,
        muscle: row.muscle,
        equipment: row.equipment,
        caution: [row.caution1, row.caution2, row.caution3].filter(caution => caution !== null && caution !== ''),
    }));

    return res.send(response(baseResponse.SUCCESS, processedRows))

}

/**
 * 3 API Name : myCalendar 추가 API
 * [POST] /app/process/end
 */
exports.postMycalendar = async function (req, res) {
    /**
     * Decoded : userId
     * Body : originRoutineIdx, totalExerciseTime, routineDetails
     */
    // 시간은 초 단위로 받기
    const userId = req.decoded.userId
    const originRoutineIdx = req.body.originRoutineIdx
    const totalExerciseTime = req.body.totalExerciseTime
    const routineContent = req.body.routineDetails

    // 총 운동 시간 유효성 검증
    if(!totalExerciseTime) {
        return res.send(response(baseResponse.PROCESS_TOTALTIME_INVALID))
    }

    // 실제 운동 리스트들 유효성 검증
    if(!routineContent) {
        return res.send(response(baseResponse.PROCESS_ROUTINECONTENT_INVALID))
    }

    // 기존 운동 루틴 Idx 유효성 검증
    if(!originRoutineIdx || originRoutineIdx === 0) {
        return res.send(response(baseResponse.PROCESS_ORIGINROUTINEIDX_INVALID))
    }

    // 새로 만들어진 routineIdx(업데이트 될 수도 있기 때문)
    const routineIdx = await processService.insertRoutineIdx(routineContent)

    // 현재 서버 시간 가져오기 (한국 시간대로 변환)
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 9); // UTC + 9

    // 추가 정보
    const userIdx = await processProvider.getUserIdx(userId)
    const weight = await processProvider.getTotalWeight(routineIdx)

    const totalWeight = weight[0].totalWeight
    const totalCalories = await processProvider.getTotalCalories(routineIdx)
    const totalDist = await processProvider.getTotalDist(routineIdx)

    if(!totalCalories) return res.send(response(baseResponse.PROCESS_CALORIES_NOT_EXIST))

    // myCalendar에 데이터 저장
    const postMyCalendar = await processService.postMyCalendar(userIdx, userId, routineIdx, originRoutineIdx, totalExerciseTime, totalWeight, currentDate, totalCalories, totalDist)

    return res.send(response(baseResponse.SUCCESS, routineContent))
}

/**
 * 4 API Name : 결과 조회 API
 * [GET] /app/process/end
 */
exports.getProcessResult = async function (req, res) {
    /**
     * Decoded : userId
     * Query Parameter : routineIdx
     */
    const userId = req.decoded.userId
    const originRoutineIdx = req.query.routineIdx
    if(!originRoutineIdx) return res.send(response(baseResponse.PROCESS_ORIGINROUTINEIDX_INVALID))

    // 현재 시간을 UTC로 가져오기
    const currentDate = new Date();
    const utcDate = new Date(currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000));

    // 9시간 추가하여 한국 시간대로 변환
    const koreanDate = new Date(utcDate.getTime() + (9 * 3600000)); // 9시간 * 60분 * 60초 * 1000밀리초

    const year = koreanDate.getFullYear();
    const month = String(koreanDate.getMonth() + 1).padStart(2, '0');
    const day = String(koreanDate.getDate()).padStart(2, '0');

    const todayDate = `${year}-${month}-${day}`;

    // 마이 캘린더에 존재하는 routineIdx인지 검증
    const checkRoutineIdx = await processProvider.getCheckMyCalendar(originRoutineIdx, todayDate)
    if(!checkRoutineIdx) return res.send(response(baseResponse.PROCESS_ROUTINEIDX_NOT_EXIST))

    // 무게, 시간 차이 조회
    const getComparison = await processProvider.getComparison(userId, originRoutineIdx)
    if(!getComparison) return res.send(response(baseResponse.PROCESS_COMPARISON_NOT_EXIST))

    // myCalendar에서 데이터 조회
    const totalData = await processProvider.getTotalData(userId, todayDate)

    // 운동 횟수 조회
    const countHealth = await processProvider.getHealthCount(userId)
    if(!countHealth || !totalData) return res.send(response(baseResponse.PROCESS_EXERCISE_NOT_EXIST))

    return res.send(response(baseResponse.SUCCESS, {
        todayTotalWeight: totalData.totalWeight,
        todayTotalCalories: totalData.totalCalories,
        todayTotalTime: totalData.totalTime,
        todayTotalDist: totalData.totalDist,
        getComparison: getComparison,
        monthCountHealth: countHealth,
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