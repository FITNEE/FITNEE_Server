const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const promotionDao = require("./promotionDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

//
exports.returnExist = async function (email, phoneNum) {
    const connection = await pool.getConnection(async (conn) => conn);
    const existResult = await promotionDao.checkExist(connection, email, phoneNum);
    connection.release();
  
    return existResult;
};