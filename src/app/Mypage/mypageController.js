const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const mypageProvider = require("./mypageProvider");
const mypageService = require("./mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
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
 * API No. 2
 * API Name : 
 * [GET] /app/mypage
 */
exports.getExerciseInfo = async function (req, res) {
    /**
     * Query String: month
     */

    
}

/**
 * API No. 3
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
 * API No. 4
 * API Name : 토큰으로 유저 검증후 유저info 조회 - userNickname, birthYear, userId 반환
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
 * API No. 5
 * API Name : 토큰으로 유저 검증후 유저정보 수정 - userNickname, birthYear수정
 * [PUT] /app/updateuser
 */
exports.updateUserData = async function (req, res) {
    const userIdFromJWT = req.decoded.userId;
    const { userNickname, birthYear } = req.body;

    if (!userNickname) return res.send(errResponse(baseResponse.MYPAGE_USERNICKNAME_EMPTY));
    if (!birthYear) return res.send(errResponse(baseResponse.MYPAGE_BIRTHYEAR_EMPTY));
    const updateUserInfo = await mypageProvider.updateUser(userIdFromJWT, userNickname, birthYear);
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 6
 * API Name :
 * [GET] /app/
 */
exports.updatePassword = async function (req, res) {

    /**
     * Query String: userID
     */
    
}


/**
 * API No. 7
 * API Name : 닉네임 변경할때 중복 닉네임 있는지 검사
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