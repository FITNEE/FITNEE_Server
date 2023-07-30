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

exports.retrieveRoutine = async function (curriIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routine = await routineDao.selectRoutine(connection, curriIdx);
    connection.release();

    return routine;
};