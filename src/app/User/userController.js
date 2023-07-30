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
     * Body: userId(이메일), userPw(비번), userNickname(실명 혹은 별명), gender(성별), height(키), weight(몸무게), birthYear(생년월일)
     */
    const { userId, userPw, userNickname, gender, height, weight, birthYear } = req.body;


    // 유효성 검사 : 빈 값 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!userPw) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    if (!userNickname) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!gender) return res.send(errResponse(baseResponse.EMPTY_GENDER));
    if (!height) return res.send(errResponse(baseResponse.EMPTY_HEIGHT));
    if (!weight) return res.send(errResponse(baseResponse.EMPTY_WEIGHT));
    if (!birthYear) return res.send(errResponse(baseResponse.EMPTY_BIRTHYEAR));

    // 유효성 검사 : 길이 체크
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (userPw.length > 20) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (userNickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));

    // 유효성 검사 : 성별, 키, 몸무게
    // 성별 : 0(남자), 1(여자)
    const validGenderValues = [0, 1];
    if (!validGenderValues.includes(gender)) return res.send(errResponse(baseResponse.INVALID_GENDER));
    if (isNaN(height) || height <= 0) return res.send(errResponse(baseResponse.INVALID_HEIGHT));
    if (isNaN(weight) || weight <= 0) return res.send(errResponse(baseResponse.INVALID_WEIGHT));

    // 이메일 형식 체크
    if (!regexEmail.test(userId)) return res.send(errResponse(baseResponse.SIGNUP_USERID_ERROR_TYPE));

    try {
        // 회원 생성 호출
        const signUpResponse = await userService.createUser(userId, userPw, userNickname, gender, height, weight, birthYear);
        
        // 토큰 발급
        const token = userService.generateToken(signUpResponse.userId)

        // 회원가입 성공 응답
        return res.send(response(baseResponse.SUCCESS, { accessToken: token }));
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


/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : userId, userPw
 */
exports.login = async function(req, res) {
    const { userId, userPw } = req.body;

    // 유효성 검사 : userId와 userPw가 제공되었는지 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!userPw) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    
    // 
    try {
        const signInResponse = await userService.postSignIn(userId, userPw);

        if (!signInResponse.isSuccess) {
            return res.send(signInResponse)
        }

        console.log(signInResponse)
        const token = userService.generateToken(signInResponse.userId)

        return res.send(response(baseResponse.SUCCESS, { accessToken: token }));
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
 * body : userNickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const userNickname = req.body.userNickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!userNickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, userNickname)
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
