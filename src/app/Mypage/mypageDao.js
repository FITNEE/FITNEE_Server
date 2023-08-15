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
                SELECT userNickname, birthYear, userId, gender
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


// // 내 기록(소모한 칼로리, 이동거리, 운동시간)
// async function selectMyRecord(connection, userId) {
//     const selectMyRecordQuery = `
//             SELECT
//                 CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1, '째 주') AS weekNumber,
//                 SUM(CASE WHEN WEEKDAY(healthDate) < 7 THEN totalCalories ELSE 0 END) AS weeklyCalories,
//                 SUM(totalDist) AS weeklyDistance,
//                 SUM(totalExerciseTime) AS weeklyExerciseTime,
//                 CASE WHEN DAY(healthDate) = 1 THEN 1 ELSE 0 END AS ifWeek1
//             FROM myCalendar
//             WHERE userId = ?
//             GROUP BY weekNumber
//             ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 1);
//     `;


//     const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);
//     console.log(myRecordRows[0].weekNumber[0], "월", myRecordRows[0].weekNumber[3],"번째주");
    
//     // Convert the string values to integers
//     const formattedRows = myRecordRows.map(row => ({
//         weekNumber: row.weekNumber,
//         weeklyCalories: parseInt(row.weeklyCalories),
//         weeklyDistance: parseInt(row.weeklyDistance),
//         weeklyExerciseTime: parseInt(row.weeklyExerciseTime),
//         ifWeek1: parseInt(row.ifWeek1)
//     }));
        
//     return formattedRows;
// }




// async function selectMyRecord(connection, userId) {
//     const selectMyRecordQuery = `
//         SELECT
//             CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1, '째 주') AS weekNumber,
//             SUM(CASE WHEN WEEKDAY(healthDate) < 7 THEN totalCalories ELSE 0 END) AS weeklyCalories,
//             SUM(totalDist) AS weeklyDistance,
//             SUM(totalExerciseTime) AS weeklyExerciseTime,
//             CASE WHEN DAY(healthDate) = 1 THEN 1 ELSE 0 END AS ifWeek1
//         FROM myCalendar
//         WHERE userId = ?
//         GROUP BY weekNumber
//         ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 1);
//     `;

//     const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);

//     // Convert the string values to integers
//     const formattedRows = [];
    
//     for (let i = 0; i < myRecordRows.length; i++) {
//         const currentRow = myRecordRows[i];
//         const nextRow = myRecordRows[i + 1];

//         formattedRows.push({
//             weekNumber: currentRow.weekNumber,
//             weeklyCalories: parseInt(currentRow.weeklyCalories),
//             weeklyDistance: parseInt(currentRow.weeklyDistance),
//             weeklyExerciseTime: parseInt(currentRow.weeklyExerciseTime),
//             ifWeek1: parseInt(currentRow.ifWeek1)
//         });

//         if (nextRow) {
//             const currentWeekNumber = parseInt(currentRow.weekNumber[3]);
//             const nextWeekNumber = parseInt(nextRow.weekNumber[3]);

//             if (nextRow.weekNumber[0] === currentRow.weekNumber[0] && nextWeekNumber - currentWeekNumber > 1) {
//                 // Calculate the values for the missing weeks
//                 for (let j = currentWeekNumber + 1; j < nextWeekNumber; j++) {
//                     formattedRows.push({
//                         weekNumber: currentRow.weekNumber[0] + '월 ' + j + '째 주',
//                         weeklyCalories: 0,
//                         weeklyDistance: 0,
//                         weeklyExerciseTime: 0,
//                         ifWeek1: parseInt(currentRow.ifWeek1)
//                     });
//                 }
//             }
//         }
//     }

//     return formattedRows;
// }

// async function selectMyRecord(connection, userId) {
//     const selectMyRecordQuery = `
//         SELECT
//             CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1, '째 주') AS weekNumber,
//             SUM(CASE WHEN WEEKDAY(healthDate) < 7 THEN totalCalories ELSE 0 END) AS weeklyCalories,
//             SUM(totalDist) AS weeklyDistance,
//             SUM(totalExerciseTime) AS weeklyExerciseTime,
//             CASE WHEN DAY(healthDate) = 1 THEN 1 ELSE 0 END AS ifWeek1
//         FROM myCalendar
//         WHERE userId = ?
//         GROUP BY weekNumber
//         ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 1);
//     `;

//     const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);

//     const formattedRows = [];
    
//     for (let i = 0; i < myRecordRows.length; i++) {
//         const currentRow = myRecordRows[i];
//         const nextRow = myRecordRows[i + 1];

//         formattedRows.push({
//             weekNumber: currentRow.weekNumber,
//             weeklyCalories: parseInt(currentRow.weeklyCalories),
//             weeklyDistance: parseInt(currentRow.weeklyDistance),
//             weeklyExerciseTime: parseInt(currentRow.weeklyExerciseTime),
//             ifWeek1: parseInt(currentRow.ifWeek1)
//         });

//         if (nextRow) {
//             const currentWeekNumber = parseInt(currentRow.weekNumber.match(/\d+/)[0]);
//             const nextWeekNumber = parseInt(nextRow.weekNumber.match(/\d+/)[0]);

//             if (nextRow.weekNumber[0] === currentRow.weekNumber[0] && nextWeekNumber - currentWeekNumber > 1) {
//                 // Calculate the values for the missing weeks
//                 for (let j = currentWeekNumber + 1; j < nextWeekNumber; j++) {
//                     formattedRows.push({
//                         weekNumber: currentRow.weekNumber[0] + '월 ' + j + '째 주',
//                         weeklyCalories: 0,
//                         weeklyDistance: 0,
//                         weeklyExerciseTime: 0,
//                         ifWeek1: parseInt(currentRow.ifWeek1)
//                     });
//                 }
//             }
//         }
//     }

//     return formattedRows;
// }


async function selectMyRecord(connection, userId) {
    const selectMyRecordQuery = `
        SELECT
            CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1, '째 주') AS weekNumber,
            SUM(CASE WHEN WEEKDAY(healthDate) < 7 THEN totalCalories ELSE 0 END) AS weeklyCalories,
            SUM(totalDist) AS weeklyDistance,
            SUM(totalExerciseTime) AS weeklyExerciseTime,
            CASE WHEN DAY(healthDate) = 1 THEN 1 ELSE 0 END AS ifWeek1
        FROM myCalendar
        WHERE userId = ?
        GROUP BY weekNumber
        ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 1);
    `;

    const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);

    const formattedRows = [];
    let prevMonth = -1;
    let prevWeek = -1;
//    console.log(myRecordRows.length);

    for (let i = 0; i < myRecordRows.length; i++) {
        const currentRow = myRecordRows[i];
        const currentMonth = parseInt(currentRow.weekNumber.match(/\d+/)[0]);
        const currentWeek = parseInt(currentRow.weekNumber.match(/\d+/g)[1]);

        if (prevMonth !== -1 && prevMonth === currentMonth && currentWeek - prevWeek > 1) {
            // Calculate the values for the missing weeks
            for (let j = prevWeek + 1; j < currentWeek; j++) {
                formattedRows.push({
                    weekNumber: currentMonth + '월 ' + j + '째 주',
                    weeklyCalories: 0,
                    weeklyDistance: 0,
                    weeklyExerciseTime: 0,
                    ifWeek1: 0
                });
            }
        }

        formattedRows.push({
            weekNumber: currentRow.weekNumber,
            weeklyCalories: parseInt(currentRow.weeklyCalories),
            weeklyDistance: parseInt(currentRow.weeklyDistance),
            weeklyExerciseTime: parseInt(currentRow.weeklyExerciseTime),
            ifWeek1: parseInt(currentRow.ifWeek1)
        });

        prevMonth = currentMonth;
        prevWeek = currentWeek;
    }

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