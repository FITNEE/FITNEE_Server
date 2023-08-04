const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const processProvider = require("./processProvider")
const processDao = require("./processDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");


exports.updateRoutineWithAlternativeExercise = async function (routineIdx, detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
        // Perform the necessary steps to update routine and routineDetail with the alternative exercise
        await processProvider.updateRoutineWithAlternativeExercise(connection, routineIdx, detailIdx);

        console.log("Successfully updated routine with alternative exercise");
    } catch (error) {
        console.error(`Error updating routine with alternative exercise: ${error.message}`);
    } finally {
        connection.release();
    }
};

exports.updateRoutineAndRoutineDetail = async function (routineIdx, detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    // Perform the necessary steps to update routine and routineDetail with the alternative exercise
    // For example, you can use the existing functions from provider and dao
    await processProvider.updateRoutineWithAlternativeExercise(connection, routineIdx, detailIdx);
    await processDao.updateRoutineDetailIdx(routineIdx, detailIdx);

    connection.release()
};

exports.isDetailIdxValid = async function (detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn);

    const isValid = Number.isInteger(parseInt(detailIdx)) && parseInt(detailIdx) > 0;
    connection.release()
    return isValid;
};

exports.isRoutineBelongsToUser = async function (userId, routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    
    const isBelongsToUser = await processProvider.isRoutineBelongsToUser(userId, routineIdx);
    connection.release()
    return isBelongsToUser;
};