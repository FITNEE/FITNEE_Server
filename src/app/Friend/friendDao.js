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

    // 새로운 배열 만들어 null 값 필터링
    const filteredFriendList = searchResultRows
        .filter((friend) => friend.friendNickname !== null)
        .map((friend) => ({ friendNickname: friend.friendNickname }));

    // 친구 수 == 필터링된 배열의 길이.
    const friendCount = filteredFriendList.length;

    return {
        friendCount,
        friendList: filteredFriendList,
    };
}

// search 받아서 healthCategory테이블의 연관 name 반환
async function searchUser(connection, search) {
    const searchUserQuery = `
        SELECT userNickname
        FROM User
        WHERE userNickname LIKE CONCAT('%', ?, '%');
    `;
    const [searchResultRows] = await connection.query(searchUserQuery, [search]);
    return searchResultRows;
}

module.exports = {
    searchFriend,
    searchUser,
};