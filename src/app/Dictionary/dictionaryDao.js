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




module.exports = {
    selectKeyword,
};