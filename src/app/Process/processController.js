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

    // dayOfWeek 유효성 검증
    if (!['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(dayOfWeek)) {
        return res.status(400).send(response(baseResponse.INVALID_DAY_OF_WEEK, 'Invalid dayOfWeek'));
    }
    
    const userId = req.decoded.userId
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

    if (replacementRecommendations.length === 0) {
        console.log("No replacement exercises found")
        return res.send(response(baseResponse.REPLACEMENT_EXERCISES_NOT_FOUND))
    }

    return res.send(response(baseResponse.SUCCESS, { replacementRecommendations }))

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
    const originRoutineIdx = req.body.routineIdx
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


    // 추가 정보
    const userIdx = await processProvider.getUserIdx(userId)
    const totalWeight = await processProvider.getTotalWeight(routineIdx)

    const parsedTotalWeight = parseInt(totalWeight[0].totalWeight);
    const totalCalories = await processProvider.getTotalCalories(routineIdx)
    const totalDist = await processProvider.getTotalDist(routineIdx)

    // myCalendar에 데이터 저장
    const postMyCalendar = await processService.postMyCalendar(userIdx, userId, routineIdx, originRoutineIdx, totalExerciseTime, parsedTotalWeight, totalCalories, totalDist)

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

    // // 오늘 날짜 정보 가져오기
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(currentDate.getDate()).padStart(2, '0');

    const todayDate = `${year}-${month}-${day}`;

    // myCalendar에서 데이터 조회
    const totalData = await processProvider.getTotalData(userId, todayDate)

    // 무게, 시간 차이 조회
    const getComparison = await processProvider.getComparison(userId, originRoutineIdx)

    // 운동 횟수 조회
    const countHealth = await processProvider.getHealthCount(userId)

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