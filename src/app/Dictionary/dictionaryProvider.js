const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const dictionaryDao = require("./dictionaryDao");


exports.retrieveKeyword = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const keywordCheckResult = await dictionaryDao.selectKeyword(connection, userIdx);
    connection.release();
  
    return keywordCheckResult;
  };