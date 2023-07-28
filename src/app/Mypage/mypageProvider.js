const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const mypageDao = require("./mypageDao");

exports.searchExercise = async function (userIdx, month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const myExerciseResult = await mypageDao.selectMyCalendar(connection,userIdx, month);
    connection.release();

    return myExerciseResult;
};