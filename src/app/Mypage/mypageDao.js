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
  

module.exports = {
    selectMyCalendar,
    selectUserNickname,
  };