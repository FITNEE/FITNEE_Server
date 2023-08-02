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
exports.updateUser = async function (userIdFromJWT, userNickname, birthYear) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userInfoUpdate = await mypageDao.updateUserInfo(connection, userNickname, birthYear, userIdFromJWT);
  connection.release();

  return userInfoUpdate;
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



//
exports.searchRecord = async function (month, day) {
  const connection = await pool.getConnection(async (conn) => conn);
  const myRecordResult = await mypageDao.selectMyRecord(connection, month, day);
  connection.release();

  return myRecordResult;
};