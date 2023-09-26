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

module.exports = {
    selectKeyword,
};