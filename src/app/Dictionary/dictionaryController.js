const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const dictionaryProvider = require("./dictionaryProvider");
const dictionaryService = require("./dictionaryService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API Name : 최근 검색키워드 5개, 인기 검색 키워드 5개
 * [GET] /app/dictionary
 */
exports.getKeywordByIdx = async function (req, res) {

    /**
     * Path Variable: userIdx
     */
    const userIdx = req.query.userIdx;

    if (!userIdx) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const keywordByUserIdx = await dictionaryProvider.retrieveKeyword(userIdx);
    return res.send(response(baseResponse.SUCCESS, keywordByUserIdx));
};