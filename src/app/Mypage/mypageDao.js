// 특정유저가 n월에 운동한 날짜
async function selectMyCalendar(connection, userIdx, month) {
    const selectMyCalendarQuery = `
                SELECT day(healthDate) as day
                FROM myCalendar
                WHERE userIdx = ? AND MONTH(healthDate) = ? AND status=0
                ORDER BY healthDate ASC;
                `;
    const myCalendar = await connection.query(selectMyCalendarQuery, [userIdx, month]);
    return myCalendar;
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
    selectUserNickname,
    selectMyRecord,
  };