const {logger} = require("../../../config/winston");
const jwtMiddleware = require("../../../config/jwtMiddleware");
const dictionaryProvider = require("./dictionaryProvider");
const dictionaryService = require("./dictionaryService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 * API Name : 최근 검색키워드 5개, 인기 검색 키워드 5개 -> 몇개 보여줄지 숫자 바꿀 수 있음.
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


/**
 * API Name : 
 * [GET] /app/exerciseinfo
 */
exports.getInformationByparts = async function (req, res) {

    /**
     * Path Variable: parts(healthCategory Table)
     */
    const parts = req.query.parts;

    if (!parts) return res.send(errResponse(baseResponse.DICTIONARY_PARTS_EMPTY));

    const exerciseInformationByParts = await dictionaryProvider.retrieveInformation(parts);
    return res.send(response(baseResponse.SUCCESS, exerciseInformationByParts));
};
