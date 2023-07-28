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
     * Query String: userIdx, month
     */
    const { userIdx, month } = req.query;

    if (!userIdx) return res.send(errResponse(baseResponse.CALENDAR_MONTH_EMPTY));
    if (!month) return res.send(errResponse(baseResponse.CALENDAR_MONTH_EMPTY));

    const exerciseByMonth = await mypageProvider.searchExercise(userIdx, month);
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
 * [GET] /app/mypage
 */
exports.getExerciseRecord= async function (req, res) {

    /**
     * Query String: month
     */
    
}

/**
 * API Name :
 * [GET] /app/mypage
 */
exports.getUserData = async function (req, res) {

    /**
     * Query String: userID
     */
    
}

/**
 * API Name :
 * [GET] /app/mypage
 */
exports.updateUserData = async function (req, res) {

    /**
     * Query String: userID
     */
    
}

/**
 * API Name :
 * [GET] /app/mypage
 */
exports.updatePassword = async function (req, res) {

    /**
     * Query String: userID
     */
    
}


/**
 * API Name :
 * [GET] /app/mypage
 */

exports.checkUserNameValid = async function (req, res) {

    /**
     * Query String: userNickName
     */
    const userId = req.query.userId;

    if (!userId) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByUserId = await userProvider.retrieveUserList(userId);
        if (userListByUserId.length === 0) {
            return res.send(response(baseResponse.SIGNIN_USERID_UNKNOWN));
        }
        return res.send(response(baseResponse.SUCCESS, userListByUserId[0]));
    }
};