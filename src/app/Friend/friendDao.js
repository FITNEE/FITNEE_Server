// // userId 받아서 친구목록 조회
async function searchFriend(connection, userIdFromJWT) {
    const searchFriendQuery = `
        SELECT DISTINCT
            CASE
                WHEN fl.fromUserIdx = u.userIdx THEN u2.userNickname
                WHEN fl.toUserIdx = u.userIdx THEN u1.userNickname
            END AS friendNickname,
            CASE
                WHEN fl.fromUserIdx = u.userIdx THEN u2.userIdx
                WHEN fl.toUserIdx = u.userIdx THEN u1.userIdx
            END AS friendUserIdx
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
        .map((friend) => ({
            friendUserIdx: friend.friendUserIdx,
            friendNickname: friend.friendNickname,
        }));

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
        SELECT userIdx, userNickname
        FROM User
        WHERE userNickname LIKE CONCAT('%', ?, '%');
    `;
    const [searchResultRows] = await connection.query(searchUserQuery, [search]);
    return searchResultRows;
}

// 친구신청
async function addFriend(connection, insertFriendParams) {
    const addFriendQuery = `
        INSERT INTO friendList (fromUserIdx, toUserIdx, status)
        VALUES(
            (SELECT userIdx FROM User WHERE userIdx = ?),
            (SELECT userIdx FROM User WHERE userIdx = ?),
            '0'
        );
    `;
    const [insertResultRows] = await connection.query(addFriendQuery, insertFriendParams);
    return insertResultRows;
}

// 내가 보낸 친구신청 조회
async function searchList(connection, userIdxFromJWT) {
    const searchFriendQuery = `
        SELECT fl.friendListIdx, fl.toUserIdx, u.userNickname
        FROM friendList AS fl
        LEFT JOIN User AS u ON fl.toUserIdx = u.userIdx
        WHERE fl.fromUserIdx = ? AND fl.status = '0';
    `;
    const [searchResultRows] = await connection.query(searchFriendQuery, userIdxFromJWT);
    return searchResultRows;
}

// 내가 보낸 친구신청 취소
async function deleteAddFriend(connection, friendListIdx, userIdxFromJWT) {
    const searchFriendQuery = `
        DELETE
        FROM friendList
        WHERE friendListIdx = ? AND fromUserIdx = ? AND status = '0';
    `;
    const [searchResultRows] = await connection.query(searchFriendQuery, [friendListIdx, userIdxFromJWT]);
    return searchResultRows;
}

// 내가 받은 친구신청 조회
async function searchReceivedList(connection, userIdxFromJWT) {
    const searchFriendQuery = `
        SELECT fl.friendListIdx, fl.fromUserIdx, u.userNickname
        FROM friendList AS fl
        LEFT JOIN User AS u ON fl.fromUserIdx = u.userIdx
        WHERE fl.toUserIdx = ? AND fl.status = '0';
    `;
    const [searchResultRows] = await connection.query(searchFriendQuery, userIdxFromJWT);
    return searchResultRows;
}

// 받은 친구신청 수락
async function acceptFriend(connection, userIdxFromJWT, friendListIdx) {
    const acceptFriendQuery = `
        UPDATE friendList
        SET status = '1'
        WHERE toUserIdx = ? AND friendListIdx = ?;
    `;
    const [updateResultRows] = await connection.query(acceptFriendQuery, [userIdxFromJWT, friendListIdx]);
    return updateResultRows;
}

// 받은 친구신청 거절
async function refuseFriend(connection, userIdxFromJWT, friendListIdx) {
    const refuseFriendQuery = `
        DELETE FROM friendList
        WHERE toUserIdx = ? AND friendListIdx = ? AND status = '0';
    `;
    const [updateResultRows] = await connection.query(refuseFriendQuery, [userIdxFromJWT, friendListIdx]);
    return updateResultRows;
}

// 친구 삭제
async function deleteFriend(connection, userIdxFromJWT, friendUserIdx) {
    const deleteFriendQuery = `
        DELETE FROM friendList
        WHERE (fromUserIdx = ? AND toUserIdx = ?) OR (fromUserIdx = ? AND toUserIdx = ?);
    `;
    const [deleteResultRows] = await connection.query(deleteFriendQuery, [userIdxFromJWT, friendUserIdx, friendUserIdx, userIdxFromJWT]);
    return deleteResultRows;
}


module.exports = {
    searchFriend,
    searchUser,
    addFriend,
    searchList,
    deleteAddFriend,
    searchReceivedList,
    acceptFriend,
    refuseFriend,
    deleteFriend,
};