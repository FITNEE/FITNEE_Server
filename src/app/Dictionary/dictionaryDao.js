// 검색 키워드, 인기 키워드 조회
async function selectKeyword(connection, userIdx) {
    const selectRecentKeywordsQuery = `
        SELECT text, COUNT(*) as searchCount
        FROM keyword
        WHERE userIdx = ?
        GROUP BY text
        ORDER BY MAX(createdAt) DESC
        LIMIT 5;
    `;

    const selectPopularKeywordsQuery = `
        SELECT text, COUNT(*) as searchCount
        FROM keyword
        GROUP BY text
        ORDER BY searchCount DESC
        LIMIT 5;
    `;

    const [recentKeywords, popularKeywords] = await Promise.all([
        connection.query(selectRecentKeywordsQuery, [userIdx]),
        connection.query(selectPopularKeywordsQuery)
    ]);

    return { recentKeywords: recentKeywords[0], popularKeywords: popularKeywords[0] };
}


// parts 받아서 운동정보 respond
async function selectInformation(connection, parts) {
    const selectExerciseInformationQuery = `
        SELECT name, parts, muscle, equipment, time, calories
        FROM healthCategory
        WHERE parts = ?;
    `;

    const [informationRows] = await connection.query(selectExerciseInformationQuery, [parts]);
    return informationRows;
}

// name 받아서 그 운동의 운동방법과 주의사항 반환
async function selectExerciseMethod(connection, name) {
    const selectExerciseInformationQuery = `
        SELECT healthMethod.num, healthMethod.title, healthMethod.content
        FROM healthCategory
        JOIN healthMethod ON healthCategory.healthCategoryidx = healthMethod.healthCategoryIdx
        WHERE healthCategory.name = ?;
    `;

    const selectExerciseCautionQuery = `
        SELECT caution1, caution2, caution3
        FROM healthCategory
        WHERE healthCategory.name = ?;
    `;

    const [exerciseinfo, exercisecaution] = await Promise.all([
        connection.query(selectExerciseInformationQuery, [name]),
        connection.query(selectExerciseCautionQuery, [name])
    ]);
    return { exerciseinfo: exerciseinfo[0], exercisecaution: exercisecaution[0] };
}


// name 받아서 그 운동의 채팅내용과 채팅 수 반환
async function selectExerciseChatting(connection, name) {
    const selectExerciseChatInfoQuery = `
        SELECT HC.userIdx,
        CASE WHEN UC.status = 2 THEN '(알수없음)' ELSE UC.userNickname END AS userNickname,
        HC.text
        FROM healthChatting AS HC
        JOIN healthCategory AS HCh ON HC.healthCategoryName = HCh.name
        JOIN User AS UC ON HC.userIdx = UC.userIdx
        WHERE HC.status = 0
        ORDER BY HC.updatedAt ASC;
    `;


    const selectExerciseChatNumQuery = `
        SELECT COUNT(*) AS chatCount
        FROM healthChatting AS HC
        WHERE HC.healthCategoryName = ? AND HC.status = 0;
    `;

    const [chattinginfo, chattingnum] = await Promise.all([
        connection.query(selectExerciseChatInfoQuery, [name]),
        connection.query(selectExerciseChatNumQuery, [name])
    ]);

    return { chattinginfo: chattinginfo[0], chattingnum: chattingnum[0][0].chatCount };
}


// 채팅 text 추가
// insertChattingParams = [name, userNickname, text];
async function insertChatting(connection, insertChattingParams) {
    const insertChattingQuery = `
    INSERT INTO healthChatting (healthCategoryName, userIdx, text)
        VALUES (
            (SELECT name FROM healthCategory WHERE name = ?),
            (SELECT userIdx FROM User WHERE userNickname = ?),
            ?
        );
    `;
    const insertChattingRow = await connection.query(insertChattingQuery, insertChattingParams);
    return insertChattingRow;
}


module.exports = {
    selectKeyword,
    selectInformation,
    selectExerciseMethod,
    selectExerciseChatting,
    insertChatting,
};