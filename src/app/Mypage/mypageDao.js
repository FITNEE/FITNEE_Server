const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

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


// async function selectMyRecord(connection, userId) {
//     const selectMyRecordQuery = `
//         SELECT
//             CONCAT(MONTH(healthDate), '월 ', WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1, '째 주') AS weekNumber,
//             SUM(CASE WHEN WEEKDAY(healthDate) < 7 THEN totalCalories ELSE 0 END) AS weeklyCalories,
//             SUM(totalDist) AS weeklyDistance,
//             SUM(totalExerciseTime) AS weeklyExerciseTime,
//             CONCAT(WEEK(LAST_DAY(healthDate), 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1) AS numberOfWeeks,
//             IF(WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1 = 1, 1, 0) AS ifWeek1
//         FROM myCalendar
//         WHERE userId = ?
//         GROUP BY weekNumber
//         ORDER BY MONTH(healthDate) ASC, WEEK(healthDate, 1);
//     `;

//     const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);

    

//     ///////////////////////////////////////////////////////////////
//     console.log("myRecordRows.length: ",myRecordRows.length);

//     var firstMonth = 0;
//     var lastMonth = 0;

//     for (let i = 0; i < myRecordRows.length; i++) {
//         var a = myRecordRows[i].weekNumber[1]
//         if((i===0||i===myRecordRows.length-1)) {
//             if(a === '월') {
//                 console.log(myRecordRows[i].weekNumber[0],"월");
//                 console.log(myRecordRows[i].weekNumber[3],"째주");
//                 console.log("");
//                 if(i===0){
//                     firstMonth = myRecordRows[i].weekNumber[0];
//                 } else {
//                     lastMonth = myRecordRows[i].weekNumber[0];
//                 }
                
//             } else {
//                 console.log(10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1],"월");
//                 console.log(myRecordRows[i].weekNumber[4],"째주");
//                 console.log("");
//                 if(i===0){
//                     firstMonth = 10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1];
//                 } else {
//                     lastMonth = 10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1];
//                 }
//             }
//         }
        
//     }
//     console.log("운동 첫달:",firstMonth," 운동 마지막달:",lastMonth);                                                  


//     ///////////////////////////////////////////////////////////////


//     //return myRecordRows;

//     const formattedRows = [];
//     let prevMonth = -1;
//     let prevWeek = -1;

//     for (let i = 0; i < myRecordRows.length; i++) {
//         const currentRow = myRecordRows[i];
//         const currentMonth = parseInt(currentRow.weekNumber.match(/\d+/)[0]);
//         const currentWeek = parseInt(currentRow.weekNumber.match(/\d+/g)[1]);

//         if (prevMonth !== -1 && prevMonth === currentMonth && currentWeek - prevWeek > 1) {
//             // Calculate the values for the missing weeks
//             for (let j = prevWeek + 1; j < currentWeek; j++) {
//                 formattedRows.push({
//                     weekNumber: currentMonth + '월 ' + j + '째 주',
//                     weeklyCalories: 0,
//                     weeklyDistance: 0,
//                     weeklyExerciseTime: 0,
//                     numberOfWeeks: parseInt(currentRow.numberOfWeeks),
//                     ifWeek1: parseInt(currentRow.ifWeek1)
//                 });
//             }
//         }

//         formattedRows.push({
//             weekNumber: currentRow.weekNumber,
//             weeklyCalories: parseInt(currentRow.weeklyCalories),
//             weeklyDistance: parseInt(currentRow.weeklyDistance),
//             weeklyExerciseTime: parseInt(currentRow.weeklyExerciseTime),
//             numberOfWeeks: parseInt(currentRow.numberOfWeeks),
//             ifWeek1: parseInt(currentRow.ifWeek1)
//         });

//         prevMonth = currentMonth;
//         prevWeek = currentWeek;
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
            CONCAT(WEEK(LAST_DAY(healthDate), 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1) AS numberOfWeeks,
            IF(WEEK(healthDate, 1) - WEEK(DATE_FORMAT(CONCAT(YEAR(healthDate), "-", MONTH(healthDate), "-01"), '%Y-%m-%d'), 1) + 1 = 1, 1, 0) AS ifWeek1
        FROM myCalendar
        WHERE userId = ?
        GROUP BY weekNumber
        ORDER BY MONTH(healthDate) ASC, YEARWEEK(healthDate, 1);
    `;

    const [myRecordRows] = await connection.query(selectMyRecordQuery, [userId]);

    ///////////////////////////////////////////////////////////////
    //console.log("myRecordRows.length: ",myRecordRows.length);

    var firstMonth = 0;
    var lastMonth = 0;

    var firstWeek = 0;
    var lastWeek = 0;

    for (let i = 0; i < myRecordRows.length; i++) {
        var a = myRecordRows[i].weekNumber[1]
        if((i===0||i===myRecordRows.length-1)) {
            if(a === '월') {
                // console.log(myRecordRows[i].weekNumber[0],"월");
                // console.log(myRecordRows[i].weekNumber[3],"째주");
                //console.log("");
                if(i===0){
                    firstMonth = myRecordRows[i].weekNumber[0];
                    firstWeek = myRecordRows[i].weekNumber[3];
                } else {
                    lastMonth = myRecordRows[i].weekNumber[0];
                    lastWeek = myRecordRows[i].weekNumber[3];
                }
                
            } else {
                // console.log(10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1],"월");
                // console.log(myRecordRows[i].weekNumber[4],"째주");
                // console.log("");
                if(i===0){
                    firstMonth = 10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1];
                    firstWeek = myRecordRows[i].weekNumber[4];
                } else {
                    lastMonth = 10*myRecordRows[i].weekNumber[0] + 1*myRecordRows[i].weekNumber[1];
                    lastWeek = myRecordRows[i].weekNumber[4];
                }
            }
        }
        
    }
    //console.log("운동 첫달:",firstMonth," 운동 마지막달:",lastMonth);    
    const startAndEndExercise = [];
    startAndEndExercise.push({
        firstMonth: parseInt(firstMonth),
        firstWeek: parseInt(firstWeek),
        lastMonth: parseInt(lastMonth),
        lastWeek: parseInt(lastWeek)
    });

    // function getWeekNumber(date) {
    //     const onejan = new Date(date.getFullYear(), 0, 1);
    //     return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    // }
    // const today = new Date();
    // const todayWeekNumber = `${today.getMonth() + 1}월 ${getWeekNumber(today)}째 주`;

    function getWeekNumber(date) {
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const daysPassed = Math.floor((date - yearStart) / 86400000) + 1;
        const weekNumber = Math.ceil(daysPassed / 7);
        
        const jan1Weekday = yearStart.getDay();
        let adjustedWeekNumber = weekNumber;
        if (jan1Weekday > 4) {
            adjustedWeekNumber -= 1;
        }
    
        return adjustedWeekNumber;
    }
    
    const today = new Date();
    const todayWeekNumber = `${today.getMonth() + 1}월 ${getWeekNumber(today)}째 주`;
    
    console.log(todayWeekNumber);
    
    

    // Create a set to keep track of the existing week numbers
    const existingWeeks = new Set();

    for (let i = 0; i < myRecordRows.length; i++) {
        const currentRow = myRecordRows[i];
        const currentMonth = parseInt(currentRow.weekNumber.match(/\d+/)[0]);
        const currentWeek = parseInt(currentRow.weekNumber.match(/\d+/g)[1]);

        // Add the week number to the set
        existingWeeks.add(currentMonth * 10 + currentWeek);
    }
    const formattedRows = [];
    const maxWeeksInMonth = 6; // Maximum number of weeks in a month

    for (let month = 1; month <= 12; month++) {
        const weeksInMonth = myRecordRows.find(row => {
            const rowMonth = parseInt(row.weekNumber.match(/\d+/)[0]);
            return rowMonth === month;
        });

        const numberOfWeeks = weeksInMonth ? weeksInMonth.numberOfWeeks : maxWeeksInMonth;

        for (let week = 1; week <= numberOfWeeks; week++) {
            const weekNumber = `${month}월 ${week}째 주`;
            const weekKey = month * 10 + week;

            const existingRow = myRecordRows.find(row => {
                const [rowMonth, rowWeek] = row.weekNumber.match(/\d+/g).map(Number);
                return rowMonth === month && rowWeek === week;
            });

            formattedRows.push({
                weekNumber,
                weeklyCalories: existingRow ? parseInt(existingRow.weeklyCalories) : 0,
                weeklyDistance: existingRow ? parseInt(existingRow.weeklyDistance) : 0,
                weeklyExerciseTime: existingRow ? parseInt(existingRow.weeklyExerciseTime) : 0,
                numberOfWeeks,
                ifWeek1: week === 1 ? 1 : 0
            });
        }
    }

    return {startAndEndExercise, todayWeekNumber, formattedRows};
}

async function updateCouponCode(connection, userId, code) {
    let current = new Date();

    const validCodeQuery = `
                  SELECT premiumDate, expireDate, status
                  FROM coupon
                  WHERE code = ?
                  `;
    const [validCode] = await connection.query(validCodeQuery, code);
    
    if (validCode.length===0) return errResponse(baseResponse.COUPON_CODE_ERROR);
    else if (validCode[0].expireDate < current) return errResponse(baseResponse.COUPON_CODE_EXPIRED);
    else if (validCode[0].status!=0) return errResponse(baseResponse.COUPON_CODE_USED);
    
    const codeUsedQuery = `
                  UPDATE coupon
                  SET status=1
                  WHERE code = ?;
                  UPDATE User
                  SET premium=1, premiumAt=NOW(), endAt=DATE_ADD(NOW(),INTERVAL ? DAY), premiumStatus=1
                  WHERE userId = ?;
                  `;
    await connection.query(codeUsedQuery, [code, validCode[0].premiumDate, userId]);

    return response(baseResponse.SUCCESS);
}

async function selectIsAlarm(connection, userId) {
    const selectIsAlarmQuery = `
                SELECT alertStatus as isAlarm
                FROM User
                WHERE userId = ?;
                `;
    const [[responseIsAlarm]] = await connection.query(selectIsAlarmQuery, userId);

    responseIsAlarm.isAlarm = (responseIsAlarm.isAlarm==='1') ? true : false;

    return responseIsAlarm;
}

async function updateIsAlarm(connection, userId) {
    const responseAlarm = await selectIsAlarm(connection, userId);
    const isAlarm = responseAlarm.isAlarm ? '0' : '1';

    const updateIsAlarmQuery = `
                UPDATE User
                SET alertStatus = ?
                WHERE userId = ?;
                `;
    // const [responseIsAlarm] = await connection.query(updateIsAlarmQuery, [isAlarm, userId]);
    await connection.query(updateIsAlarmQuery, [isAlarm, userId]);

    return ;
}


module.exports = {
    selectMyCalendar,
    selectUserInfo,
    updateUserInfo,
    searchUserPw,
    updateUserPw,
    selectUserNickname,
    selectMyRecord,
    updateCouponCode,
    selectIsAlarm,
    updateIsAlarm
  };