const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const routineDao = require("./routineDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveMyRoutines = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const myRoutineResult = await routineDao.selectMyRoutine(connection, userId);
    connection.release();

    return myRoutineResult;
};