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

    const date = req.query.date;
    const userId = req.decoded.userId

    // 유효성 검증: date는 8자리 정수여야 함
    if (!/^\d{8}$/.test(date)) {
        return res.send(response(baseResponse.MYPAGE_DATE_INVALID));
    }

    const exerciseName = await processProvider.getMycalendar(date, userId)

    // 운동 기록이 하나도 없을 경우
    if(exerciseName === 0) return res.send(response(baseResponse.MYPAGE_EXERCISE_NOT_EXIST))

    // 마이캘린더에서 조회
    const realTotal = await processProvider.getRealTotal(userId, date)

    const totalWeight = realTotal.totalWeight
    const totalCalories = realTotal.totalCalories
    const totalTime = realTotal.totalExerciseTime
    const totalDist = realTotal.totalDist

    return res.send(response(baseResponse.SUCCESS, {
        exercise: exerciseName,
        totalCalories: totalCalories,
        totalWeight: totalWeight,
        totalTime: totalTime,
        totalDist: totalDist
    }))
}

/**
 * API No. 3
 * API Name : 최근 일주일 데이터 조회
 * [GET] /app/mypage/record
 */
exports.getExerciseRecord= async function (req, res) {

    /**
     * Query String: month
     * Decoded : userId
     */
    // const { month } = req.query;
    // if (!month) return res.send(errResponse(baseResponse.CALENDAR_MONTH_EMPTY));
    // if (!day) return res.send(errResponse(baseResponse.CALENDAR_DAY_EMPTY));

    const userId = req.decoded.userId

    const recordByMonth = await mypageProvider.searchRecord(userId);
    return res.send(response(baseResponse.SUCCESS, recordByMonth));
}

/**
 * API No. 4
 * API Name : 토큰으로 유저 검증후 유저info 조회 - userNickname, birthYear, userId, gender 반환
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

/**
 * API Name : 쿠폰 등록 API
 * [POST] /app/mypage/coupon
 */
exports.registCode = async function (req, res) {
    const userId = req.decoded.userId;
    const { code } = req.body;
    if (!code) return res.send(errResponse());

    console.log(userId, "- regist Coupon:", code);
    const responseRegistCode = await mypageService.registCode(userId, code);

    return res.send(responseRegistCode);
}

/**
 * API Name : 알림 수신 여부 조희 API
 * [GET] /app/mypage/isalarm
 */
exports.getIsAlarm = async function (req, res) {
    const userId = req.decoded.userId;

    const responseIsAlarm = await mypageProvider.getIsAlarm(userId);
    return res.send(response(baseResponse.SUCCESS, responseIsAlarm));
}

/**
 * API Name : 알림 수신 여부 수정 API
 * [PUT] /app/mypage/isalarm
 */
exports.putIsAlarm = async function (req, res) {
    const userId = req.decoded.userId;

    const responseIsAlarm = await mypageService.putIsAlarm(userId);
    return res.send(responseIsAlarm);
}

/**
 * API Name : 알림 내용 저장 API
 * [POST] /app/mypage/alarm
 */
exports.postAlarm = async function (req, res) {
    const userIdx = req.decoded.userIdx;
    const { content } = req.body;
    if (!content) return res.send(errResponse(baseResponse.MYPAGE_CONTENT_EMPTY));

    const responsePostAlarm = await mypageService.postAlarm(userIdx, content);
    return res.send(responsePostAlarm);
}

/**
 * API Name : 알림 내역 조회 API
 * [GET] /app/mypage/alarm
 */
exports.getAlarm = async function (req, res) {
    const userIdx = req.decoded.userIdx;

    const responseIsAlarm = await mypageProvider.getAlarm(userIdx);
    return res.send(response(baseResponse.SUCCESS, responseIsAlarm));
}