const {logger} = require("../../../config/winston");
const mypageProvider = require("./mypageProvider");
const mypageService = require("./mypageService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const processProvider = require("../Process/processProvider")

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
 * API Name : 선택한 날짜 운동 정보 조회
 * [GET] /app/mypage/exercise
 */
exports.getExerciseInfo = async function (req, res) {
    /**
     * Query String: date
     * Decoded : userId
     */

    const date = req.query.date

    // 유효성 검증: date는 YYYYMMDD 형식으로 8글자여야 함
    if (!/^\d{8}$/.test(date)) {
        return res.send(response(baseResponse.MYPAGE_DATE_INVALID));
    }

    // 문자열을 날짜 객체로 변환
    const dateObj = new Date(date)
    
    // 요일 계산 (0 : 일요일, 1 : 월요일, ... 6 : 토요일)
    const weekday = dateObj.getDay()
    const weekdays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

    const dayOfWeek = weekdays[weekday]

    // dayOfWeek 유효성 검증
    if (!['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].includes(dayOfWeek)) {
        return res.send(response(baseResponse.INVALID_DAY_OF_WEEK));
    }

    const userId = req.decoded.userId

    const exerciseInfo = await processProvider.getRoutineDetails(dayOfWeek, userId)

    // exercise 데이터 조회
    const exerciseResult = exerciseInfo.routineDetails.map(detail => ({
        order: detail.order,
        exerciseInfo: {
            healthCategoryIdx: detail.exerciseInfo.healthCategoryIdx,
            exerciseName: detail.exerciseInfo.exerciseName,
            weight: detail.weight
        }
    }))

    const totalWeight = exerciseInfo.totalWeight
    const totalCalories = exerciseInfo.totalCalories
    const totalTime = exerciseInfo.totalTime

    res.status(200).json({
        exercise: exerciseResult,
        totalCalories: totalCalories,
        totalWeight: totalWeight,
        totalTime: totalTime,
    })
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
 * API Name : 토큰으로 유저 검증후 유저정보 수정 - userNickname수정
 * [PUT] /app/mypage/updateuser
 */
exports.updateUserData = async function (req, res) {
    const userIdFromJWT = req.decoded.userId;
    const { userNickname } = req.body;

    if (!userNickname) return res.send(errResponse(baseResponse.MYPAGE_USERNICKNAME_EMPTY));
    const updateUserInfo = await mypageProvider.updateUser(userIdFromJWT, userNickname);
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 6
 * API Name : 닉네임 변경할때 중복 닉네임 있는지 검사(db에 중복된 닉네임 있는지 t/f - 불리언으로 반환)
 * [GET] /app/mypage/nickname
 */

exports.checkUserNameValid = async function (req, res) {

    /**
     * Query String: userNickName
     */
    const userNickName = req.query.userNickName;
    if (!userNickName) return res.send(errResponse(baseResponse.MYPAGE_USERNICKNAME_EMPTY));

    if (!userNickName) {
        // 닉네임 전체 조회
        const nicknameListResult = await mypageProvider.retrieveNicknameList();
        return res.send(response(baseResponse.SUCCESS, nicknameListResult));
    } else {
        // 닉네임 검색 조회2
        const nicknameListByUserId = await mypageProvider.retrieveNicknameList(userNickName);
        if (nicknameListByUserId.length === 0) {
            return res.send(response(baseResponse.SIGNIN_USERID_UNKNOWN));
        }
        return res.send(response(baseResponse.SUCCESS, nicknameListByUserId));
    }
};

/**
 * API No. 7
 * API Name : 토큰으로 유저 검증후 userPw 수정
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
        // 기존 pw와 다른 pw를 입력했을때 -> 수정
        const updateUserPw = await mypageService.updatePassword(userIdFromJWT, hashedPassword);
        return res.send(response(baseResponse.SUCCESS));
    }
}

/**
 * API No. 8
 * API Name : 토큰으로 유저 검증후 userPw 확인
 * [POST] /app/mypage/comparepwd
 */
exports.comparePassword = async function (req, res) {
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
    
    // 기존 pw와 수정할 pw가 같을때
    if (hashedPassword === originPw[0].userPw) return res.send(response(baseResponse.MYPAGE_USERPW_EQUAL2));
    else {
        // 기존 pw와 다른 pw를 입력했을때
        return res.send(errResponse(baseResponse.MYPAGE_USERPW_UNEQUAL));
    }
}