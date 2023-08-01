const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

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
    if (userId.length > 20) return res.send(errResponse(baseResponse.LENGTH_ID));
    if (userPw.length > 20) return res.send(errResponse(baseResponse.LENGTH_PASSWORD));
    if (userNickname.length > 24) return res.send(errResponse(baseResponse.LENGTH_NAME));

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
        const nicknameExists = await userProvider.nicknameCheck(userNickname)
        if (nicknameExists) {
            return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME))
        }

        // 회원 생성 호출
        const signUpResponse = await userService.postSignUp(userId, userPw, userNickname, gender, height, weight, birthYear);

        // 회원가입(signUp) 성공 시, auto Login을 처리하여 accessToken 발급
        if (signUpResponse.isSuccess) {
            // 로그인(signIn) 변수 할당
            const signInResponse = await userService.postSignIn(userId, userPw, res)
            
            if (signInResponse.isSuccess) {
                const accessToken = signInResponse.result.accessToken
                // 로그인 성공 응답
                return res.send(response(baseResponse.SUCCESS, {
                    userId: userId,
                    userNickname: userNickname,
                    accessToken: accessToken,
                    message: "로그인 성공",
                }))
            }
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
        if (userListByUserId.length === 0) {
            return res.send(response(baseResponse.SIGNIN_USERID_UNKNOWN));
        }
        return res.send(response(baseResponse.SUCCESS, userListByUserId[0]));
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
        const signInResponse = await userService.postSignIn(userId, userPw, res);

        if (!signInResponse.isSuccess) {
            return res.send(signInResponse)
        }

        const accessToken = signInResponse.result.accessToken
        // const refreshToken = signInResponse.result.refreshToken

        console.log("login.accessToken:", accessToken)
        
        // '토큰-> 쿠키' 설정
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 쿠키 만료 시간 : 1년
        })
        
        return res.send(response(baseResponse.SUCCESS, {
             accessToken: accessToken,
            //  refreshToken: refreshToken,
            }));
    } catch (error) {
        logger.error(`로그인 API 오류: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/user/:userId
 * path variable : userId
 * body : userNickname
 */
exports.patchUsers = async function (req, res) {
    // jwt - userId, path variable :userId
    // jwtMiddleware에서 발급된 decoded()를 받아오기
    const userIdFromJWT = req.decoded.userId
    console.log("patchUsers.userIdFromJWT:", userIdFromJWT)
    console.log("patchUsers.req.decoded:", req.decoded)

    // userNickname 값을 body에 입력하기
    const userNickname = req.body.userNickname;
    console.log("patch.userNickname:", userNickname)

    // userNickname이 없을 경우
    if (!userNickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    // userNickname이 중복일 경우
    const userNicknameExists = await userProvider.nicknameCheck(userNickname)
    if (userNicknameExists) return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME))

    // 수정할 정보
    const editUserInfo = await userService.editUser(userId, userNickname)
    return res.send(editUserInfo);
};




/**
 * API No. 5
 * API Name : 자동 로그인
 * [GET] /app/user/auto-login
 * path variable : userId
 * body : userNickname
 */
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 * 230801 보류(박준규)
 */
// exports.autoLogin = async function (req, res) {
//     // jwtMiddleware에서 토큰 검증된 userId 호출
//     const userIdResult = req.decoded.userId;
//     console.log("autoLogin.userIdResult:", userIdResult);

//     try {
//         // 자동 로그인 성공
//         return res.send(response(baseResponse.SUCCESS, { userId: userId }))
//     } catch (error) {
//         console.error(`Auto Login API Error: ${error.message}`)
//         return res.send(errResponse(baseResponse.SERVER_ERROR))
//     }
// };
