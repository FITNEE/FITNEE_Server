//검색 키워드, 인기 키워드 조회
async function selectKeyword(connection, userIdFromJWT) {
    const selectRecentKeywordsQuery = `
        SELECT U.userId, K.text, K.createdAt
        FROM User U
        INNER JOIN keyword K ON U.userIdx = K.userIdx
        WHERE U.userId = ?
        GROUP BY K.text
        ORDER BY K.updatedAt DESC
        LIMIT 5;
    `;

    const selectPopularKeywordsQuery = `
        SELECT text, SUM(searchCount) as totalSearchCount
        FROM keyword
        GROUP BY text
        ORDER BY totalSearchCount DESC
        LIMIT 5;
    `;

    const [recentKeywords, popularKeywords] = await Promise.all([
        connection.query(selectRecentKeywordsQuery, [userIdFromJWT]),
        connection.query(selectPopularKeywordsQuery)
    ]);

    return { recentKeywords: recentKeywords[0], popularKeywords: popularKeywords[0] };
}

// search 받아서 검색 keyword DB에 저장
async function putKeyword(connection, search, userIdFromJWT) {
    const checkDuplicateQuery = `
        SELECT keywordIdx, searchCount
        FROM keyword
        WHERE text = ? AND userId = (SELECT userIdx FROM User WHERE userId = ?);
    `;

    const [duplicateRows] = await connection.query(checkDuplicateQuery, [search, userIdFromJWT]);

    if (duplicateRows.length > 0) {
        const updateKeywordQuery = `
            UPDATE keyword
            SET searchCount = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE keywordIdx = ?;
        `;

        await connection.query(updateKeywordQuery, [duplicateRows[0].searchCount + 1, duplicateRows[0].keywordIdx]);
    } else {
        const insertKeywordQuery = `
            INSERT INTO keyword (text, userIdx, userId)
            VALUES (?, (SELECT userIdx FROM User WHERE userId = ?), ?)
            ON DUPLICATE KEY UPDATE searchCount = searchCount + 1, updatedAt = CURRENT_TIMESTAMP;
        `;

        await connection.query(insertKeywordQuery, [search, userIdFromJWT, userIdFromJWT]);
    }
}



// search 받아서 healthCategory테이블의 연관 name 반환
async function searchKeyword(connection, search) {
    const searchKeywordQuery = `
        SELECT healthCategoryIdx, name, parts, muscle, equipment
        FROM healthCategory
        WHERE name LIKE CONCAT('%', ?, '%') AND status = '0';
    `;
    const [searchResultRows] = await connection.query(searchKeywordQuery, [search]);
    return searchResultRows;
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
    const [exerciseinfo] = await connection.query(selectExerciseInformationQuery, [name]);
    const [exercisecaution] = await connection.query(selectExerciseCautionQuery, [name]);
    const cautionArray = [exercisecaution[0].caution1, exercisecaution[0].caution2, exercisecaution[0].caution3].filter(caution => caution !== null && caution !== "");
    
    const exerciseCaution = [];
    exerciseCaution.push({
        caution: cautionArray
    });

    return { exerciseinfo: exerciseinfo, exercisecaution: exerciseCaution };
}


// name 받아서 그 운동의 채팅내용과 채팅 수 반환
async function selectExerciseChatting(connection, name) {
    const selectExerciseChatInfoQuery = `
        SELECT HC.userIdx,
        UC.userNickname AS userNickname,
        HC.healthChattingIdx,
        HC.text,
        HC.status
        FROM healthChatting AS HC
        JOIN healthCategory AS HCh ON HC.healthCategoryName = HCh.name
        LEFT JOIN User AS UC ON HC.userIdx = UC.userIdx
        WHERE HC.healthCategoryName = ? AND HC.status = 0
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
            (SELECT userIdx FROM User WHERE userId = ?),
            ?
        );
    `;
    const insertChattingRow = await connection.query(insertChattingQuery, insertChattingParams);
    return insertChattingRow;
}

// 채팅 삭제(healthChatting의 status를 0 -> 1로 변경)
async function updateChattInfo(connection, userId, healthChattingIdx) {
    const updateChattingQuery = `
        UPDATE healthChatting AS HC
        JOIN User AS U ON HC.userIdx = U.userIdx
        SET HC.status = '1'
        WHERE U.userId = ? AND HC.healthChattingIdx = ?;    
    `;

    const updateChattingRow = await connection.query(updateChattingQuery, [userId, healthChattingIdx]);
    return updateChattingRow;
}

// 채팅 어디까지 읽었는지 여부 userChatRead테이블 업데이트
async function updateChattRead(connection, userIdFromJWT, healthChattingIdx) {
    const existingRowQuery = `
        SELECT * FROM userChatRead
        WHERE userIdx = (SELECT userIdx FROM User WHERE userId = ?)
        AND healthCategoryName = (SELECT healthCategoryName FROM healthChatting WHERE healthChattingIdx = ?);
    `;
    
    const existingRows = await connection.query(existingRowQuery, [userIdFromJWT, healthChattingIdx]);
    
    if (existingRows[0].length === 0) {
        // If no existing row found, insert a new row
        const insertQuery = `
            INSERT INTO userChatRead (userIdx, healthCategoryName, lastReadChatidx)
            VALUES (
                (SELECT userIdx FROM User WHERE userId = ?),
                (SELECT healthCategoryName FROM healthChatting WHERE healthChattingIdx = ?),
                ?
            );
        `;
        // await connection.query(insertQuery, [userIdFromJWT, healthChattingIdx, healthChattingIdx]);
        const updateChattReadRow = await connection.query(insertQuery, [userIdFromJWT, healthChattingIdx, healthChattingIdx]);
        return updateChattReadRow;
    } else {
        // If existing row found, update the lastReadChatidx
        const updateQuery = `
            UPDATE userChatRead
            SET lastReadChatidx = GREATEST(lastReadChatidx, ?)
            WHERE userIdx= (SELECT userIdx FROM User WHERE userId = ?) AND healthCategoryName = ?;
        `;
        // await connection.query(updateQuery, [healthChattingIdx, userIdFromJWT, existingRows[0].healthCategoryName]);
        const updateChattReadRow = await connection.query(updateQuery, [healthChattingIdx, userIdFromJWT, existingRows[0][0].healthCategoryName]);
        return updateChattReadRow;
    }
}

async function readResult(connection, userIdFromJWT, name) {
    const chatExistQuery = `
        SELECT CASE WHEN EXISTS (
            SELECT 1
            FROM healthChatting
            WHERE healthCategoryName = ? AND status = 0
            LIMIT 1
        ) THEN TRUE ELSE FALSE END AS chatExists;
    `;

    const [chatExist] = await connection.query(chatExistQuery, [name]);

    if (chatExist[0].chatExists === 1) {
        const chattReadInformationQuery = `
            SELECT
                IFNULL(
                    (
                        SELECT
                            IF(
                                userChatReadIdx IS NULL,
                                1,
                                IF(
                                    lastReadChatidx < (
                                        SELECT MAX(healthChattingIdx) FROM healthChatting WHERE healthCategoryName = ?
                                    ),
                                    1,
                                    0
                                )
                            ) AS hasUnreadChats
                        FROM userChatRead
                        WHERE userIdx = (SELECT userIdx FROM User WHERE userId = ?)
                        AND healthCategoryName = ?
                        LIMIT 1
                    ),
                    1
                ) AS hasUnreadChats;
        `;
        const [informationRows] = await connection.query(chattReadInformationQuery, [name, userIdFromJWT, name]);
        return { chatExist: chatExist[0], informationRows: informationRows[0] };
    } else {
        return { chatExist: chatExist[0] };
    }
}


module.exports = {
    selectKeyword,
    putKeyword,
    searchKeyword,
    selectInformation,
    selectExerciseMethod,
    selectExerciseChatting,
    insertChatting,
    updateChattInfo,
    updateChattRead,
    readResult,
};