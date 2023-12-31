const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const dictionaryProvider = require("./dictionaryProvider");
const dictionaryDao = require("./dictionaryDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

exports.createChatting = async function (name, userIdFromJWT, text) {
    try {
        const insertChattingParams = [name, userIdFromJWT, text];

        const connection = await pool.getConnection(async (conn) => conn);

        const chattingResult = await dictionaryDao.insertChatting(connection, insertChattingParams);
        console.log(`추가된 채팅 healthChattingIdx : ${chattingResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createChatting Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 채팅 삭제
exports.deleteChatt = async function (userId, healthChattingIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editChattResult = await dictionaryDao.updateChattInfo(connection, userId, healthChattingIdx)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - deleteChatt Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}