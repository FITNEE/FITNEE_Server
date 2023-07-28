// 특정유저 n월에 운동한 날짜
async function selectMyCalendar(connection, month) {
    const selectMyCalendarQuery = `
                SELECT healthDate
                FROM myCalendar
                WHERE month(healthDate)= ?;
                `;
    const [myCalendar] = await connection.query(selectMyCalendarQuery, [userId, month]);
    return myCalendar;
}