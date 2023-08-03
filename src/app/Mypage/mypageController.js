const {logger} = require("../../../config/winston");
const mypageProvider = require("./mypageProvider");
const mypageService = require("./mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const crypto = require("crypto");

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
 * [PUT] /app/mypage/updateuser
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
 * API Name : 토큰으로 유저 검증후 userPw 수정 todo: 기존 비밀번호와 같으면 수정x
 * [PUT] /app/mypage/updatepwd
 */
exports.updatePassword = async function (req, res) {
    const userIdFromJWT = req.decoded.userId;
    const { userPw } = req.body;
    if (!userPw) return res.send(errResponse(baseResponse.MYPAGE_USERPW_EMPTY));

    // 비밀번호 암호화
    const hashedPassword = crypto
    .createHash("sha512")
    .update(userPw)
    .digest("hex");

    // 기존pw와 body.userPw비교(같으면 수정X)
    const originPw = await mypageProvider.searchPw(userIdFromJWT)
    console.log("originPw:",originPw[0].userPw);
    console.log("hasshePW:",hashedPassword);
    
    // 기존 pw와 수정할 pw가 같을때 -> 수정x
    if (hashedPassword === originPw[0].userPw) return res.send(errResponse(baseResponse.MYPAGE_USERPW_EQUAL));
    else {
        console.log("3");
        // 기존 pw와 다른 pw를 입력했을때 -> 수정
        const updateUserPw = await mypageService.updatePassword(userIdFromJWT, hashedPassword);
        return res.send(response(baseResponse.SUCCESS));
    }
}
    


/**
 * API No. 7
 * API Name : 닉네임 변경할때 중복 닉네임 있는지 검사
 * [GET] /app/mypage/nickname
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