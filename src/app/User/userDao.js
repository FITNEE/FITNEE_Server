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
  const [userIdRows] = await connection.query(selectUserUserIdQuery, [userId]);
  return userIdRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT userId, userNickname
                 FROM User
                 WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, [userId]);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(userId, userPw, userNickname, gender, height, weight, birthYear)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// userPw 불러오기
async function getPasswordByUserId(connection, userId) {
  try {
    const getPasswordQuery = `
      SELECT userPw
      FROM User
      WHERE userId = ? AND status = '1';
    `;
    console.log("userId :", userId)
    const [passwordRows] = await connection.query(getPasswordQuery, userId);
    return passwordRows;
  } catch (err) {
    throw err;
  }
}

// // 패스워드 체크(기존에 있던 코드, 혹시나해서 남겨놓음)
// async function selectUserPassword(connection, selectUserPasswordParams) {
//   const selectUserPasswordQuery = `
//         SELECT userId, userPw
//         FROM User
//         WHERE userId = ? AND userPw = ?;`;
//   const selectUserPasswordRow = await connection.query(
//       selectUserPasswordQuery,
//       selectUserPasswordParams
//   );

//   return selectUserPasswordRow;
// }

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, userId) {
  const selectUserAccountQuery = `
        SELECT userId, userNickname, status
        FROM User
        WHERE userId = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      userId
  );
  return selectUserAccountRow[0];
}

async function updateUserInfo(connection, userId, userNickname) {
  const updateUserQuery = `
  UPDATE User
  SET userNickname = ?
  WHERE userId = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [userNickname, userId]);
  return updateUserRow[0];
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

module.exports = {
  selectUser,
  selectUserUserId,
  selectUserId,
  insertUserInfo,
  getPasswordByUserId,
  selectUserAccount,
  updateUserInfo,
  selectUserNickname
};