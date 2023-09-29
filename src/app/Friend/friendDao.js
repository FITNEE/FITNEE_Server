// userId 받아서 친구목록 조회
async function searchFriend(connection, userIdFromJWT) {
    const searchFriendQuery = `
        SELECT DISTINCT
            CASE
                WHEN fl.fromUserIdx = u.userIdx THEN u2.userNickname
                WHEN fl.toUserIdx = u.userIdx THEN u1.userNickname
            END AS friendNickname
        FROM friendList AS fl
        LEFT JOIN User AS u ON u.userId = ?
        LEFT JOIN User AS u1 ON u1.userIdx = fl.fromUserIdx
        LEFT JOIN User AS u2 ON u2.userIdx = fl.toUserIdx
        WHERE (u1.userIdx IS NOT NULL OR u2.userIdx IS NOT NULL) AND (u1.status = 1 AND u2.status = 1) AND fl.status = '1';
    `;
    const [searchResultRows] = await connection.query(searchFriendQuery, [userIdFromJWT]);

    // null 값을 필터링하여 새로운 배열을 생성합니다.
    const filteredFriendList = searchResultRows
        .filter((friend) => friend.friendNickname !== null)
        .map((friend) => ({ friendNickname: friend.friendNickname }));

    // 친구 목록의 갯수는 필터링된 배열의 길이입니다.
    const friendCount = filteredFriendList.length;

    return {
        friendCount,
        friendList: filteredFriendList,
    };
}



module.exports = {
    searchFriend,
};