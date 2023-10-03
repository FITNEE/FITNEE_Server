const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const friendProvider = require("./friendProvider");
const friendDao = require("./friendDao");

// 친구신청
exports.friendAdd = async function (userIdxFromJWT, friendIdx) {
    const insertFriendParams = [userIdxFromJWT, friendIdx];
    const connection = await pool.getConnection(async (conn) => conn);
    const friendDbAdd = await friendDao.addFriend(connection, insertFriendParams);
    connection.release();
  
    return friendDbAdd;
};

// 친구신청 취소
exports.deleteAddFriendList = async function (friendListIdx, userIdxFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const friendDbDelete= await friendDao.deleteAddFriend(connection, friendListIdx, userIdxFromJWT);
    connection.release();
  
    return friendDbDelete;
};