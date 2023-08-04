const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const processProvider = require("./processProvider")
const processDao = require("./processDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// 기존 데이터 수정
exports.updateRoutineAndRoutineDetail = async function (routineIdx, detailIdx, selectedHealthCategoryIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // routineDetail 수정
        const updateRoutineDetailAndRoutine = await processDao.updateHealthCategoryIdx(connection, selectedHealthCategoryIdx, routineIdx, detailIdx)

        connection.release();

        return updateRoutineDetailAndRoutine
    } catch (err) {
        throw err;
    }
};