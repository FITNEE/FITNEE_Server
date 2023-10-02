const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const routineDao = require("./routineDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.insertRoutine = async function (userId, isPremium, info, gpt) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoutine = await routineDao.insertRoutine(connection, userId, isPremium, info, gpt);
        connection.release();
    
        return response(baseResponse.SUCCESS, insertRoutine);
    } catch (err) {
        logger.error(`App - insertRoutine Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
};

exports.insertRoutineCalendar = async function (userId, routineCalendar) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const insertRoutineCalendar = await routineDao.insertRoutineCalendar(connection, userId, routineCalendar);
        connection.release();
    
        return response(baseResponse.SUCCESS, insertRoutineCalendar);
    } catch (err) {
        logger.error(`App - insertRoutineCalendar Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
};

exports.updateRoutineCalendar = async function (userId, routineCalendar) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateRoutineCalendar = await routineDao.updateRoutineCalendar(connection, userId, routineCalendar);
        connection.release();
    
        return response(baseResponse.SUCCESS, updateRoutineCalendar);
    } catch (err) {
        logger.error(`App - updateRoutineCalendar Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
}

exports.updateRoutine = async function (userId, routineIdx, routineContent) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const putRoutine = await routineDao.updateRoutine(connection, userId, routineIdx, routineContent);
        connection.release();
    
        return response(baseResponse.SUCCESS, putRoutine);
    } catch (err) {
        logger.error(`App - updateRoutine Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
};

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

exports.insertLastProcess = async function (userId, date, originIdx, content) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateRoutineCalendar = await routineDao.insertLastProcess(connection, userId, date, originIdx, content);
        connection.release();
    
        return response(baseResponse.SUCCESS, updateRoutineCalendar);
    } catch (err) {
        logger.error(`App - insertLastProcess Service error\n: ${err.message}`);
        return errResponse(baseResponse.TRANSACTION_ERROR);
    }
}