const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const friendProvider = require("./friendProvider");
const friendDao = require("./friendDao");


exports.friendAdd = async function (userIdxFromJWT, friendIdx) {
    const insertFriendParams = [userIdxFromJWT, friendIdx];
    const connection = await pool.getConnection(async (conn) => conn);
    const friendDbADD = await friendDao.addFriend(connection, insertFriendParams);
    connection.release();
  
    return friendDbADD;
};