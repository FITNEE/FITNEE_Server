const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const processDao = require("./processDao");

// Provider: Read 비즈니스 로직 처리

// 오늘 루틴 리스트 뽑아오기
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

// 오늘 날짜를 요일로 변환
exports.getTodayRoutineIdx = async function (userId) {
    function getDayOfWeek() {
        const daysOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const today = new Date();
        const dayIndex = today.getDay();
        return daysOfWeek[dayIndex];
    }
    const connection = await pool.getConnection(async (conn) => conn)

    const dayOfWeek = getDayOfWeek();
    const routineIdx = await processDao.getTodayRoutineIdx(userId, dayOfWeek)
    connection.release()

    return routineIdx
}

// userId 매치 검증
exports.isDetailIdxBelongsToUser = async function (userId, detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn)
    const result = await processDao.checkDetailIdx(connection, userId, detailIdx);
    connection.release()

    return result;
};

// parts 추출
exports.getExercisePart = async function (detailIdx) {
    const connection = await pool.getConnection(async (conn) => conn)
    const exercisePart = processDao.getExercisePart(connection, detailIdx);
    connection.release()

    return exercisePart;
};

// 대체 운동 get
exports.getReplacementExercises = async function (detailIdx, exercisePart) {
    const connection = await pool.getConnection(async (conn) => conn)

    const maxRecommendations = 3;
    const replacementRecommendations = await processDao.getReplacementExercisesLimited(connection, detailIdx, exercisePart, maxRecommendations);
    connection.release()

    return replacementRecommendations;

};

// 대체한 운동의 healthCategoryIdx로 routineDetail 수정
exports.updateHealthCategoryInRoutineDetail = async function (selectedHealthCategoryIdx, routineDetailIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        // routineDetail 수정
        await processDao.updateRoutineDetail(connection, selectedHealthCategoryIdx, routineDetailIdx);

        // 대체한 운동의 status를 1로 업데이트
        await processDao.updateRoutineStatus(connection, routineDetailIdx);

        connection.release();
    } catch (err) {
        throw err;
    }
};

exports.saveTime = async function (userId, routineDetailIdx, timeInMinutes) {
    const connection = await pool.getConnection(async (conn) => conn)
    try {
        const saveTimeResult = await processDao.saveTime(connection, userId, routineDetailIdx, timeInMinutes);

        connection.release()
        return saveTimeResult;
    } catch (err) {
        throw err;
    }
};