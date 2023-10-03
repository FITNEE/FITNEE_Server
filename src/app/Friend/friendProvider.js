const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const friendDao = require("./friendDao");


exports.searchFriendList = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const friendCheckResult = await friendDao.searchFriend(connection, userIdFromJWT);
    connection.release();
  
    return friendCheckResult;
};

// user 검색
exports.searchFriend = async function (search) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userResult = await friendDao.searchUser(connection, search);
    connection.release();
  
    return userResult;
};

// 내가 보낸 친구신청 조회
exports.addFriendList = async function (userIdxFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const addResult = await friendDao.searchList(connection, userIdxFromJWT);
    connection.release();
  
    return addResult;
};


// 받은 친구신청 조회
exports.getReceiveList = async function (userIdxFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const addResult = await friendDao.searchReceivedList(connection, userIdxFromJWT);
    connection.release();
  
    return addResult;
};