const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const mypageProvider = require("./mypageProvider");
const mypageDao = require("./mypageDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


// 유저 비밀번호 수정
exports.updatePassword = async function (userIdFromJWT, hashedPassword) {
    
    // 비밀번호 암호화
    // const hashedPassword = crypto
    // .createHash("sha512")
    // .update(userPw)
    // .digest("hex");

    const userInfoParams = [hashedPassword, userIdFromJWT];

    const connection = await pool.getConnection(async (conn) => conn);
    const userPwUpdate = await mypageDao.updateUserPw(connection, userInfoParams);
    connection.release();
  
    return userPwUpdate;
  };

// 쿠폰 등록 API
exports.registCode = async function (userId, code) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const updateCouponCode = await mypageDao.updateCouponCode(connection, userId, code);
    connection.release();

    return updateCouponCode;
  } catch (err) {
    console.error(`APP - registCode Service error\n: ${err.message}`);
    return errResponse(baseResponse.TRANSACTION_ERROR);
  }
};