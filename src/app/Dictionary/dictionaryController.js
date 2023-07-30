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
 * API Name : parts 받아서 그 parts에 포함된 모든 운동 정보(name, muscle, equipment, time, calorie) 조회
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


/**
 * API Name : name 받아서 그 운동의 운동방법과 주의사항 반환
 * [GET] /app/exercisemethod
 */
exports.getMethodByName = async function (req, res) {

    /**
     * Path Variable: parts(healthCategory Table)
     */
    const name = req.query.name;

    if (!name) return res.send(errResponse(baseResponse.DICTIONARY_NAME_EMPTY));

    const exerciseMethodByName = await dictionaryProvider.retrieveMethod(name);
    return res.send(response(baseResponse.SUCCESS, exerciseMethodByName));
};

/**
 * API Name : name 받아서 그 운동의 채팅 반환
 * [GET] /app/exercisechat
 */
exports.getChattingByName = async function (req, res) {

    /**
     * Path Variable: parts(healthCategory Table)
     */
    const name = req.query.name;

    if (!name) return res.send(errResponse(baseResponse.DICTIONARY_NAME_EMPTY));

    const exerciseChatByName = await dictionaryProvider.retrieveChatting(name);
    return res.send(response(baseResponse.SUCCESS, exerciseChatByName));
};