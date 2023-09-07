const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const promotionDao = require("./promotionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

//동일한 이메일 있으면 전화번호 덮어쓰기
exports.changePhoneNum = async function (email, phoneNum) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changePromotion = await promotionDao.changePhoneNum(connection, email, phoneNum);
        connection.release();

        return response(baseResponse.SUCCESS, changePromotion);
    } catch (err) {
        logger.error(`App - insertPromotion Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
}

//동일한 전화번호 있으면 이메일 덮어쓰기
exports.changeEmail = async function (email, phoneNum) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const changePromotion = await promotionDao.changeEmail(connection, email, phoneNum);
        connection.release();

        return response(baseResponse.SUCCESS, changePromotion);
    } catch (err) {
        logger.error(`App - insertPromotion Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
}


exports.insertPromotion = async function (email, phoneNum) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertPromotion = await promotionDao.insertPromotion(connection, email, phoneNum);
        connection.release();

        return response(baseResponse.SUCCESS, insertPromotion);
    } catch (err) {
        logger.error(`App - insertPromotion Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
}