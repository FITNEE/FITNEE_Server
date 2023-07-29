const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const dictionaryDao = require("./dictionaryDao");

//
exports.retrieveKeyword = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const keywordCheckResult = await dictionaryDao.selectKeyword(connection, userIdx);
    connection.release();
  
    return keywordCheckResult;
  };

//
exports.retrieveInformation = async function (parts) {
    const connection = await pool.getConnection(async (conn) => conn);
    const exerciseInformationResult = await dictionaryDao.selectInformation(connection, parts);
    connection.release();

    return exerciseInformationResult;
};