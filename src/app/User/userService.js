const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 회원가입
exports.postSignUp = async function (userId, userPw, userNickname, gender, height, weight, birthYear) {
    try {
        // 이메일 중복 확인
        const userIdRows = await userProvider.userIdCheck(userId);
        if (userIdRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_USERID);

        // 비밀번호 암호화
        const hashedPassword = crypto
            .createHash("sha512")
            .update(userPw)
            .digest("hex");

        const insertUserInfoParams = [userId, hashedPassword, userNickname, gender, height, weight, birthYear];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - postSignUp Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 로그인
exports.postSignIn = async function (userId, userPw, res) {
    try {
        // 이메일 여부 확인
        const userIdRows = await userProvider.userIdCheck(userId);
        if (userIdRows.length < 1) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        // userId에 해당하는 유저 정보 가져오기
        const userResult = await userProvider.getPassword(userId)

        // 비밀번호 확인
        const hashedPasswordInput = crypto
            .createHash("sha512")
            .update(userPw)
            .digest("hex");
        const storedPasswordHash = userResult[0].userPw

        // 해시 userPw와 비교
        if (hashedPasswordInput !== storedPasswordHash) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG)
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(userId);

        // 현재 상태가 회원(1)인지, 탈퇴 회원(2)인지 확인
        if (userInfoRows[0].status === '2') return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT)

        // access Token 및 refresh Token 발급
        let accessToken = ''
        // let refreshToken = ''
        if (userInfoRows[0].status === '1') {
            const payload = {
                userId: userId,
            }
            try {
                accessToken = jwt.sign(payload, secret_config.jwtsecret, {
                    expiresIn: '30d',
                    algorithm: 'HS256',
                })
                // refreshToken = jwt.sign({}, secret_config.jwtsecret, {
                //     expiresIn: '365d',
                //     algorithm: 'HS256'
                // })
            } catch (error) {
                console.log("Error generating token:", error)
            }
        }
        
        return response(baseResponse.SUCCESS, {
            isSuccess: true,
            userId: userId,
            accessToken: accessToken,
            // refreshToken: refreshToken,
        });

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 닉네임 수정
exports.editUser = async function (userId, userNickname) {
    try {
        console.log("editUser.userId:", userId)

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, userId, userNickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}