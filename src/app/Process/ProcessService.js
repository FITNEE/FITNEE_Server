const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
// const routineDao = require("./routineDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.deleteRoutine = async function (userId, routineIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteRoutine = await routineDao.deleteRoutine(connection, userId, routineIdx);
        connection.release();
    
        return response(baseResponse.SUCCESS, deleteRoutine);
    } catch (err) {
        logger.error(`App - deleteRoutine Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
};