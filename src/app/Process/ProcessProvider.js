const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const processDao = require("./processDao");

// Provider: Read 비즈니스 로직 처리

// before 운동 /  세트, 무게, 횟수
exports.retrieveBeforeProcessDetail = async function (routineDetailIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const BeforeProcessDetail = await processDao.selectBeforeProcessDetail(connection, routineDetailIdx);
    connection.release();

    return BeforeProcessDetail;
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