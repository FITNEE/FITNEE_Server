// 특정유저가 n월에 운동한 날짜
async function selectMyCalendar(connection, userIdFromJWT, month) {
    const selectMyCalendarQuery = `
                SELECT day(healthDate) as day
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
                SET userNickname = ?,
                    birthYear = ?
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


// 내 기록(최근 일주일간 이동거리, 일주일간 소모한 칼로리, 모든 누적 운동시간)
async function selectMyRecord(connection, month, day) {
    const selectMyRecordQuery = `
                
                `;

    const myRecord = await connection.query(selectMyRecordQuery, [userIdx, month]);
    return myRecord;
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