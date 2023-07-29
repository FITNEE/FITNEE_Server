// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT userId, userNickname 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserUserId(connection, userId) {
  const selectUserUserIdQuery = `
                SELECT userId, userNickname 
                FROM User
                WHERE userId = ?;
                `;
  const [userIdRows] = await connection.query(selectUserUserIdQuery, userId);
  return userIdRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, userId, userNickname
                 FROM User
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(userId, userPw, userNickname)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT userId, userPw
        FROM User
        WHERE userId = ? AND userPw = ?;`;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userId) {
  const selectUserAccountQuery = `
        SELECT id, userId, userNickname, status
        FROM User
        WHERE userId = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userId
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, id, userNickname) {
  const updateUserQuery = `
  UPDATE User
  SET userNickname = ?
  WHERE id = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [userNickname, id]);
  return updateUserRow[0];
}


module.exports = {
  selectUser,
  selectUserUserId,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
};