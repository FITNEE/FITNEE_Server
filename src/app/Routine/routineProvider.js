const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const routineDao = require("./routineDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRoutineCalendar = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routineCalendar = await routineDao.selectRoutineCalendar(connection, userId);
    connection.release();

    return routineCalendar;
};

exports.retrieveRoutineParts = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routineCalendar = await routineDao.selectRoutineParts(connection, userId);
    connection.release();

    return routineCalendar;
}

exports.retrieveTodayRoutine = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const todayRoutine = await routineDao.selectTodayRoutine(connection, userId);
    connection.release();

    return todayRoutine;
};

exports.retrieveRoutine = async function (routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routine = await routineDao.selectRoutine(connection, routineIdx);
    connection.release();

    return routine;
};

exports.endProcess = async function (userId, isPremium) {
    const connection = await pool.getConnection(async (conn) => conn);
    const endProcess = await routineDao.endProcess(connection, userId, isPremium);
    connection.release();

    return endProcess;
};