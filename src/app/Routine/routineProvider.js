const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const routineDao = require("./routineDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRoutines = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routines = await routineDao.selectRoutines(connection, userId);
    connection.release();

    return routines;
};

exports.retrieveRoutineCurri = async function (curriIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routineCurri = await routineDao.selectRoutineCurri(connection, curriIdx);
    connection.release();

    return routineCurri;
};