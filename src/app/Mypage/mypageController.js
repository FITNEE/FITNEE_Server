const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const mypageProvider = require("./mypageProvider");
const mypageService = require("./mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API Name : getExerckseData 한달간 운동한 날짜
 * [GET] /app/mypage
 */
exports.getExercisedData = async function (req, res) {
    /**
     * Query String: month
     */
    const userIdFromJWT = req.decoded.userId;
    const month = req.query.month;

    if (!month) return res.send(errResponse(baseResponse.CALENDAR_MONTH_EMPTY));

    const exerciseByMonth = await mypageProvider.searchExercise(userIdFromJWT, month);
    return res.send(response(baseResponse.SUCCESS, exerciseByMonth));
}

/**
 * API Name : 
 * [GET] /app/mypage
 */
exports.getExerciseInfo = async function (req, res) {
    /**
     * Query String: month
     */

    
}

/**
 * API Name :
 * [GET] /app/mypage/record
 */
exports.getExerciseRecord= async function (req, res) {

    /**
     * Query String: month
     */
    const { month, day } = req.query;
    if (!month) return res.send(errResponse(baseResponse.CALENDAR_MONTH_EMPTY));
    if (!day) return res.send(errResponse(baseResponse.CALENDAR_DAY_EMPTY));

    const recordByMonth = await mypageProvider.searchRecord(month, day);
    return res.send(response(baseResponse.SUCCESS, recordByMonth));

}

/**
 * API Name :
 * [GET] /app/mypage/userinfo
 */
exports.getUserData = async function (req, res) {
    /**
     * Query String: userID
     */
    const userIdFromJWT = req.decoded.userId;

    const dataByUserId = await mypageProvider.searchUserInfo(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, dataByUserId));
    
}

/**
 * API Name :
 * [GET] /app/
 */
exports.updateUserData = async function (req, res) {

    /**
     * Query String: userID
     */
    
}

/**
 * API Name :
 * [GET] /app/
 */
exports.updatePassword = async function (req, res) {

    /**
     * Query String: userID
     */
    
}


/**
 * API Name :
 * [GET] /app/nickname
 */

exports.checkUserNameValid = async function (req, res) {

    /**
     * Query String: userNickName
     */
    const userNickName = req.query.userNickName;

    if (!userNickName) {
        // 닉네임 전체 조회
        const nicknameListResult = await mypageProvider.retrieveNicknameList();
        return res.send(response(baseResponse.SUCCESS, nicknameListResult));
    } else {
        // 닉네임 검색 조회
        const nicknameListByUserId = await mypageProvider.retrieveNicknameList(userNickName);
        if (nicknameListByUserId.length === 0) {
            return res.send(response(baseResponse.SIGNIN_USERID_UNKNOWN));
        }
        return res.send(response(baseResponse.SUCCESS, nicknameListByUserId));
    }
};