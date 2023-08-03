const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const processDao = require("./processDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveRoutineRow = async function (routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const [routineRow] = await connection.query(
        'SELECT * FROM routine WHERE routineIdx = ?',
        [routineIdx]
      );
      connection.release();
      return routineRow[0] || null;
};

// before 운동 /  세트, 무게, 횟수
exports.retrieveBeforeProcessDetail = async function (routineIdx) {
    // Fetch the routine row based on routineIdx
    const routineRow = await this.retrieveRoutineRow(routineIdx);


    if (!routineRow) {
        return null;
    }

    // Create an array to store non-null and greater than 0 values from detailIdx0 to detailIdx9
    const routine_list = [];

    // Loop through detailIdx0 to detailIdx9 and store non-null and greater than 0 values in routine_list
    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routineRow[`detailIdx${i}`];
        if (detailIdxValue !== null && detailIdxValue > 0) {
            routine_list.push(detailIdxValue);
        }
    }

    const connection = await pool.getConnection(async (conn) => conn);
    // Use routine_list to query the 'routineDetail' table
    const beforeProcessDetail = await processDao.selectBeforeProcessDetail(connection, routine_list);


    return beforeProcessDetail;
};

// 운동 중 / 세트, 무게, 횟수
exports.retrieveProcessDetail = async function (routineIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const routineDetail = await processDao.selectProcessDetail(connection, routineIdx);
    connection.release();

    return routineDetail;
}

// 시간, 총무게, 소요칼로리(db 추가)
exports.retrieveProcessEnd = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const processEnd = await processDao.selectMyCalendar(connection, userId);
    connection.release();

    return routine;
};

// gpt콜..
exports.retrieveProcessEndDetail = async function (userId) {

}