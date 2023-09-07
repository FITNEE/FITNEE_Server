const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const promotionDao = require("./promotionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

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