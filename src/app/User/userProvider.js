const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// 유저 리스트 조회
exports.retrieveUserList = async function (userId) {
  if (!userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserUserId(connection, userId);
    connection.release();

    return userListResult;
  }
};

// 유저 조회
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

// 유저 아이디 체크
exports.userIdCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdCheckResult = await userDao.selectUserUserId(connection, userId);
  connection.release();

  return userIdCheckResult;
};

// 유저 비밀번호 체크
exports.getPassword = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn)
    const passwordRows = await userDao.getPasswordByUserId(connection, userId);
    connection.release()
    return passwordRows;
  } catch (err) {
    throw err;
  }
};

// 기존에 있던 userPw 비교 함수.
// exports.passwordCheck = async function (selectUserPasswordParams) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const passwordCheckResult = await userDao.selectUserPassword(
//       connection,
//       selectUserPasswordParams
//   );
//   connection.release();
//   return passwordCheckResult[0];
// };

exports.accountCheck = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, userId);
  connection.release();

  return userAccountResult;
};

// 닉네임 중복 검사
exports.nicknameCheck = async function (userNickname) {
  const connection = await pool.getConnection(async (conn) => conn)
  const userNicknameResult = await userDao.selectUserByNickname(connection, userNickname)
  connection.release()
  return userNicknameResult.length > 0
}