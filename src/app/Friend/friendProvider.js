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