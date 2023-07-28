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

module.exports = {
    selectMyCalendar,
  };