const {logger} = require("../../../config/winston");
const processProvider = require("./processProvider");
const processService = require("./processService")
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * 1 API Name : 운동 루틴 조회 API
 * [GET] /app/process/:routineIdx
 */
exports.getRoutine = async function (req, res) {
    /**
     * Path Variable : dayOfWeek
     * 
     */

    // 날짜 및 아이디
    const dayOfWeek = req.query.dayOfWeek;
    const userId = req.decoded.userId
    const routine = await processProvider.getRoutineDetails(dayOfWeek, userId);

    return res.send(response(baseResponse.SUCCESS, routine));
};


// /**
//  * 2 API Name : 운동별 과정 전 조회 API
//  * [GET] /app/process/before/:routineIdx
//  */
// exports.getBeforeProcessDetail = async function (req, res) {

//     /**
//      * Path Variable : routineIdx
//      */
//     const routineIdx = req.params.routineIdx
//     const beforeProcessDetail = await processProvider.retrieveBeforeProcessDetail(routineIdx)

//     return res.send(response(baseResponse.SUCCESS, beforeProcessDetail))
// }

// /**
//  * 3 API Name : 운동별 과정 중 조회 API
//  * [GET] /app/process/detail/:routineIdx
//  */
// exports.getProcessDetail = async function (req, res) {
//     /**
//      * Path Variable : routineIdx
//      */
//     const routineIdx = req.params.routineIdx
//     const routineDetail = await processProvider.retrieveProcessDetail(routineIdx)

//     return res.send(response(baseResponse.SUCCESS, routineDetail))
// }

/**
 *  4-1 API Name : 운동 루틴 대체 추천 API\
 * [GET] /app/process/:healthCategoryIdx
 */
exports.getReplacementRecommendations = async function (req, res) {
    /**
     * Path Variable : healthCategoryIdx
     */
        const healthCateogryIdx = req.params.healthCategoryIdx


        // 동일 parts 내에서 랜덤 추출
        const replacementRecommendations = await processProvider.getReplacementExercises(healthCateogryIdx)

        if (replacementRecommendations.length === 0) {
            console.log("No replacement exercises found")
            return res.send(response(baseResponse.REPLACEMENT_EXERCISES_NOT_FOUND))
        }

        return res.send(response(baseResponse.SUCCESS, { replacementRecommendations }))

}


/**
 *  4-2 API 이름 : 대체된 운동 정보 업데이트 API
 * [PATCH] /app/process/replace/exercise
 */
exports.replaceExerciseInRoutine = async function (req, res) {
    try {
        // detailIdx가 아니라 순서, selectedHealthCategoryIdx는 프론트에서 모르니깐 대체 get에서 Idx도 함께 보내주기
        const { routineDetailIdx, selectedHealthCategoryIdx } = req.body;

        // 유효성 검증
        if (!Number.isInteger(parseInt(routineDetailIdx)) || parseInt(routineDetailIdx) <= 0) {
            return res.send(response(baseResponse.INVALID_ROUTINE_IDX));
        }

        await processProvider.updateHealthCategoryInRoutineDetail(selectedHealthCategoryIdx, routineDetailIdx)

        return res.send(response(baseResponse.SUCCESS));
    } catch (err) {
        console.error(`Error in replaceExerciseInRoutine Controller: ${err}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};

// /**
//  * 5 API Name : 운동 루틴 '전체' 중단 API
//  * [PATCH] /app/process/:routineIdx
//  */
// exports.patchProcess = async function (req, res) {
//     /**
//      * Decoded: userId
//      * Path Variable : routineIdx
//      * Body : status
//      */
//     const userId = req.decoded.userId
//     const routineIdx = req.params.routineIdx
//     const routineStatus = req.body
    
//     const responsePatchProcess = await ProcessService.updateProcess(userId, routineIdx, routineStatus)

//     return res.send(responsePatchProcess)
// }

/**
 * 6 API Name : 운동 건너뛰기 API
 * [PATCH] /app/process/:routineDetailIdx
 */
exports.skipExercise = async function (req, res) {
    try {
        const { routineDetailIdx } = req.params

        // 운동 건너뛰기 (skip 값을 1로 업데이트)
        await processService.updateSkipValue(routineDetailIdx);

        return res.send(response(baseResponse.SUCCESS));
    } catch (err) {
        console.error(`Error in skipExercise Controller: ${err}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};

// /** // 물어보기
//  * 7 API Name : 운동 루틴 캘린더 기록 API
//  * [POST] /app/process/:routineIdx/end
//  */
// exports.saveTime = async function (req, res) {
//     try {
//         const { routineDetailIdx , timeInMinutes } = req.params;
//         const userId = req.decoded.userId

//         const saveTimeResult = await processService.saveTime(userId, routineDetailIdx, timeInMinutes);

//         if (saveTimeResult) {
//             return res.send(response(baseResponse.SUCCESS));
//         } else {
//             return res.send(response(baseResponse.DB_ERROR));
//         }
//     } catch (err) {
//         console.error(`Error in saveTime Controller: ${err}`);
//         return res.send(response({ message: '서버 오류' }));
//     }
// };

// /**
//  * 8 API Name : 운동 결과 개요 API
//  * [GET] /app/process/:routineIdx/end
//  */
// exports.getProcessEnd = async function (req, res) {
//     /**
//      * Decoded : userId
//      */
//     const userId = req.decoded.userId

//     const ProcessEnd = await processProvider.retrieveProcessEnd(userId)

//     if(!ProcessEnd) return res.send(errResponse)
//     else return res.send(baseResponse.SUCCESS, ProcessEnd)
// }


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