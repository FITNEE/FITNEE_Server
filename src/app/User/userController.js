const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    /**
     * Body: userId(이메일), userPw(비번), userName(실명), userNickName(별명), addressIdx(주소), sex(성별), height(키), career(운동경력), weight(몸무게), birth(생년월일)
     */
    const { userId, userPw, userName, userNickName, addressIdx, sex, height, career, weight, birth } = req.body;

    // 유효성 검사 : 빈 값 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!userPw) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    if (!userName) return res.send(errResponse(baseResponse.EMPTY_NAME));
    if (!userNickName) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!addressIdx) return res.send(errResponse(baseResponse.EMPTY_ADDRESSIDX));
    if (!sex) return res.send(errResponse(baseResponse.EMPTY_SEX));
    if (!height) return res.send(errResponse(baseResponse.EMPTY_HEIGHT));
    if (!career) return res.send(errResponse(baseResponse.EMPTY_CAREER));
    if (!weight) return res.send(errResponse(baseResponse.EMPTY_WEIGHT));
    if (!birth) return res.send(errResponse(baseResponse.EMPTY_BIRTH));

    // 유효성 검사 : 길이 체크
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (userPw.length > 20) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (userName.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));
    if (userNickName.length > 24) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

    // 유효성 검사 : 운동 경력, 성별, 키, 몸무게
    const validCareerValues = [0, 1, 2];
    const validSexValues = [0, 1];
    if (!validCareerValues.includes(career)) return res.send(errResponse(baseResponse.INVALID_CAREER));
    if (!validSexValues.includes(sex)) return res.send(errResponse(baseResponse.INVALID_SEX));
    if (isNaN(height) || height <= 0) return res.send(errResponse(baseResponse.INVALID_HEIGHT));
    if (isNaN(weight) || weight <= 0) return res.send(errResponse(baseResponse.INVALID_WEIGHT));

    // 이메일 형식 체크
    if (!regexEmail.test(userId)) return res.send(errResponse(baseResponse.SIGNUP_USERID_ERROR_TYPE));

    try {
        // 회원 생성 호출
        const signUpResponse = await userService.createUser(userId, userPw, userName, userNickName, addressIdx, sex, height, career, weight, birth);
        
        // 회원가입 성공 응답
        return res.send(response(baseResponse.SUCCESS, signUpResponse));
    } catch (error) {
        logger.error(`회원 가입 API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: userId
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

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : userId, password
 */
exports.login = async function(req, res) {
    const { userId, password } = req.body;

    // 유효성 검사 : userId와 password가 제공되었는지 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!password) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));

    // 
    try {
        const signInResponse = await userService.postSignIn(userId, password);
        return res.send(signInResponse);
    } catch (error) {
        logger.error(`로그인 API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
