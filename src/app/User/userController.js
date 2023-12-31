const {logger} = require("../../../config/winston");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/user
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
        console.log(userListByUserId);
        if (userListByUserId.length < 1)
            return res.send(response(baseResponse.SIGNIN_USERID_UNKNOWN));
        else if (userListByUserId[0].withdrawUserId)
            return res.send(response(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT));
        return res.send(response(baseResponse.SUCCESS, userListByUserId));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/user/{userId}
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

setCookie = async function(res, accessToken) {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now()+365 * 24 * 60 * 60 * 1000) // 쿠키 만료 시간 : 1년
    })
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/user
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
    if (userId.length >= 40) return res.send(errResponse(baseResponse.LENGTH_ID));
    // if (userPw.length > 20) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    // if (userNickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));

    // 유효성 검사 : 성별, 키, 몸무게
    // 성별 : 1(남자), 2(여자)
    const validGenderValues = [1, 2];
    if (!validGenderValues.includes(gender)) return res.send(errResponse(baseResponse.INVALID_GENDER));
    if (isNaN(height) || height <= 0) return res.send(errResponse(baseResponse.INVALID_HEIGHT));
    if (isNaN(weight) || weight <= 0) return res.send(errResponse(baseResponse.INVALID_WEIGHT));

    // 이메일 형식 체크
    if (!regexEmail.test(userId)) return res.send(errResponse(baseResponse.SIGNUP_USERID_ERROR_TYPE));

    try {
        // 닉네임 중복 체크
        const nicknameExists = await userProvider.nicknameCheck(userNickname);
        if (nicknameExists) return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));

        // 회원 생성 호출
        const signUpResponse = await userService.postSignUp(userId, userPw, userNickname, gender, height, weight, birthYear);
        console.log(signUpResponse);

        // 회원가입(signUp) 성공 시, 바로 로그인 처리
        if (signUpResponse.isSuccess) {
            const signInResponse = await userService.postSignIn(userId, userPw);
            console.log(signInResponse);
            
            if (signInResponse.isSuccess) {
                const accessToken = signInResponse.result.accessToken;
                setCookie(res, accessToken);

                // 로그인 성공 응답
                return res.send(response(baseResponse.SUCCESS, {
                    userId: userId,
                    userNickname: userNickname,
                    accessToken: accessToken,
                    message: "로그인 성공",
                }))
            }
        } else {
            return res.send(signUpResponse);
        }

        // 회원가입 성공 응답
        return res.send(response(baseResponse.SUCCESS, {
            userId: userId,
            userNickname: userNickname,
         }));
    } catch (error) {
        logger.error(`회원 가입 API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};

/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/user/login
 * body : userId, userPw
 */
exports.login = async function(req, res) {
    const userId = req.body.userId;
    const userPw = req.body.userPw;
    
    // 유효성 검사 : userId와 userPw가 제공되었는지 체크
    if (!userId) return res.send(errResponse(baseResponse.EMPTY_ID));
    if (!userPw) return res.send(errResponse(baseResponse.EMPTY_PASSWORD));
    
    // 
    try {
        const signInResponse = await userService.postSignIn(userId, userPw);
        if (!signInResponse.isSuccess) return res.send(signInResponse);

        const accessToken = signInResponse.result.accessToken;
        setCookie(res, accessToken);
        
        return res.send(response(baseResponse.SUCCESS, {accessToken: accessToken}));
    } catch (error) {
        logger.error(`로그인 API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};

exports.check = async function(req, res) {
    const userId = req.decoded.userId;
    const isPremium = req.decoded.isPremium;

    try {
        const accessTokenCheck = await userService.accessTokenCheck(userId, isPremium);
        console.log(accessTokenCheck);

        if (!accessTokenCheck.isSuccess) return res.send(signInResponse);
        else if (!accessTokenCheck.result) return res.send(baseResponse.SUCCESS);

        const accessToken = accessTokenCheck.result.accessToken;
        setCookie(res, accessToken);
        
        return res.send(response(baseResponse.SUCCESS, {accessToken: accessToken}));
    } catch (error) {
        logger.error(`토큰 check API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
}


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/user/:userId
 * path variable : userId
 * body : userNickname
 */
exports.patchUsers = async function (req, res) {
    // jwt - userId, path variable :userId
    
    const userIdFromJWT = req.decoded.userId;
    const userNickname = req.body.userNickname;

    // userNickname이 없을 경우
    if (!userNickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    // userNickname이 중복일 경우
    const userNicknameExists = userProvider.nicknameCheck(userNickname);
    if (!userNicknameExists) return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));

    // 수정할 정보
    const editUserInfo = await userService.editUser(userIdFromJWT, userNickname);
    return res.send(editUserInfo);
};

/**
 * API Name : 회원 탈퇴 API
 * [DELETE] /app/user
 * decoded: userId
 */
exports.deleteUser = async function (req, res) {
    const userId = req.decoded.userId;

    try {
        const deleteUserResponse = await userService.deleteUser(userId);
        return res.send(deleteUserResponse);
    } catch (err) {
        logger.error(`회웥 탈퇴 API Error: ${err.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
}

/**
 * 
 * API Name : 가장 최근 로그인한 디바이스토큰 db에 저장
 * [PUT] /app/user/device
 * path variable : userId
 */
exports.deviceToken = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.decoded.userId;
    const devToken = req.query.devToken;

    //if (!userId) return res.send(errResponse(baseResponse.USER_USER_USERID_EMPTY));
    if (!devToken) return res.send(errResponse(baseResponse.USER_USER_DEVTOKEN_EMPTY));

    const postToken = await userService.putToken(userId, devToken);
    return res.send(response(baseResponse.SUCCESS, postToken));
};

/**
 * 
 * API Name : 로그아웃할 때 디바이스토큰값 삭제
 * [PUT] /app/user/deleteToken
 * path variable : userId
 */
exports.deleteToken = async function (req, res) {
    /**
     * Path Variable: userId
     */
    const userId = req.decoded.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USER_USERID_EMPTY));

    const deleteToken = await userService.deleteToken(userId);
    return res.send(response(baseResponse.SUCCESS, deleteToken));
};