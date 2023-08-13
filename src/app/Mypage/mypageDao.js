// 특정유저가 n월에 운동한 날짜
async function selectMyCalendar(connection, userIdFromJWT, month) {
    const selectMyCalendarQuery = `
                SELECT healthDate as day
                FROM myCalendar
                WHERE userId = ? AND MONTH(healthDate) = ? AND status=0
                ORDER BY healthDate ASC;
                `;
    const [myCalendar] = await connection.query(selectMyCalendarQuery, [userIdFromJWT, month]);
    return myCalendar;
}

// userId로 info 반환
async function selectUserInfo(connection, userIdFromJWT) {
    const selectUserInfoQuery = `
                SELECT userNickname, birthYear, userId
                FROM User
                WHERE userId = ?;
                `;
    const [myInfo] = await connection.query(selectUserInfoQuery, [userIdFromJWT]);
    return myInfo;
}

// userId로 info 수정
async function updateUserInfo(connection, userNickname, birthYear, userIdFromJWT) {
    const updateUserInfoQuery = `
                UPDATE User
                SET userNickname = ?
                WHERE userId = ?;
                `;
    const [updateInfo] = await connection.query(updateUserInfoQuery, [userNickname, birthYear, userIdFromJWT]);
    return updateInfo;
}


// userId로 pw 조회
async function searchUserPw(connection, userIdFromJWT) {
    const searchUserPwQuery = `
                SELECT userPw
                FROM User
                WHERE userId = ?;
                `;
    const [searchPw] = await connection.query(searchUserPwQuery, [userIdFromJWT]);
    return searchPw;
}


// userId로 info 수정
async function updateUserPw(connection, userInfoParams) {
    const updateUserInfoQuery = `
                UPDATE User
                SET userPw = ?
                WHERE userId = ?;
                `;
    const [updatePw] = await connection.query(updateUserInfoQuery, userInfoParams);
    return updatePw;
}

// db에 존재하는 닉네임인지 boolean으로 반환
async function selectUserNickname(connection, userNickName) {
    const selectNicknameQuery = `
                SELECT EXISTS(
                    SELECT 1
                    FROM User
                    WHERE userNickname = ?
                ) as isNicknameExist;
                `;
  
    const [rows] = await connection.query(selectNicknameQuery, [userNickName]);
    const isNicknameExist = rows[0].isNicknameExist === 1; // 1이면 true, 0이면 false로 반환
  
    return isNicknameExist;
}


// 내 기록(소모한 칼로리, 이동거리, 운동시간)
async function selectMyRecord(connection, userId) {
    const selectMyRecordQuery = `
        SELECT
            CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 2) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 2) + 1, '째 주') AS weekNumber,
            SUM(CASE WHEN WEEKDAY(healthDate) < 6 THEN totalCalories ELSE 0 END) AS weeklyCalories,
            SUM(totalDist) AS weeklyDistance,
            SUM(totalExerciseTime) AS weeklyExerciseTime
        FROM myCalendar
        WHERE userId = ?
        GROUP BY weekNumber
        ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 2);;
    `;

    const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);
    
    // Convert the string values to integers
    const formattedRows = myRecordRows.map(row => ({
        weekNumber: row.weekNumber,
        weeklyCalories: parseInt(row.weeklyCalories),
        weeklyDistance: parseInt(row.weeklyDistance),
        weeklyExerciseTime: parseInt(row.weeklyExerciseTime)
    }));
        
    return formattedRows;
}












module.exports = {
    selectMyCalendar,
    selectUserInfo,
    updateUserInfo,
    searchUserPw,
    updateUserPw,
    selectUserNickname,
    selectMyRecord,
  };