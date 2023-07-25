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
     * Body: userId, userPw, userName, email, userNickname, addressIdx
     */
    const { userId, userPw, userName, email, userNickname, addressIdx} = req.body;

    // 빈값 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!userPw) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    if (!userName) return res.send(errResponse(baseResponse.EMPTY_NAME));
    if (!email) return res.send(errResponse(baseResponse.EMPTY_EMAIL));
    if (!userNickname) return res.send(errResponse(baseResponse.EMPTY_NICKNAME));
    if (!addressIdx) return res.send(errResponse(baseResponse.EMPTY_ADDRESSIDX));

    // check length of value
    if (id.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (password.length > 20 || password.length < 6) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (userName.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));
    if (nickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NICKNAME));

    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    const signUpResponse = await userService.createUser(userId, userPw, userName, email, userNickname, addressIdx);

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        if (userListByEmail.length === 0) {
            return res.send(response(baseResponse.SIGNIN_EMAIL_UNKNOWN));
        }
        return res.send(response(baseResponse.SUCCESS, userListByEmail[0]));
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
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
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
