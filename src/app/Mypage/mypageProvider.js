const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const mypageDao = require("./mypageDao");


//
exports.searchExercise = async function (userIdFromJWT, month) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myExerciseResult = await mypageDao.selectMyCalendar(connection,userIdFromJWT, month);
  connection.release();

  return myExerciseResult;
};

//
exports.searchUserInfo = async function (userIdFromJWT) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoResult = await mypageDao.selectUserInfo(connection,userIdFromJWT);
  connection.release();

  return userInfoResult;
};


// 유저정보 수정
exports.updateUser = async function (userIdFromJWT, userNickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoUpdate = await mypageDao.updateUserInfo(connection, userNickname, userIdFromJWT);
  connection.release();

  return userInfoUpdate;
};

// 유저pw 조회
exports.searchPw = async function (userIdFromJWT) {
  const connection = await pool.getConnection(async (conn) => conn);
  const searchUserPw = await mypageDao.searchUserPw(connection, userIdFromJWT);
  connection.release();
  
  return searchUserPw;
};


//
exports.retrieveNicknameList = async function (userNickName) {
  if (!userNickName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const nicknameListResult = await mypageDao.selectUserNickname(connection);
    connection.release();

    return nicknameListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const nicknameListResult = await mypageDao.selectUserNickname(connection, userNickName);
    connection.release();

    return nicknameListResult;
  }
};



// 최근 일주일 데이터 조회
exports.searchRecord = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myRecordResult = await mypageDao.selectMyRecord(connection, userId);
  connection.release();

  return myRecordResult;
};