const {logger} = require("../../../config/winston");
const dictionaryProvider = require("./dictionaryProvider");
const dictionaryService = require("./dictionaryService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 *  * API No. 1
 * API Name : 최근 검색키워드 5개, 인기 검색 키워드 5개 -> 몇개 보여줄지 숫자 바꿀 수 있음.
 * [GET] /app/dictionary
 */
exports.getKeywordByIdx = async function (req, res) {

    /**
     * Path Variable: userIdx
     */
    const userIdFromJWT = req.decoded.userId;

    if (!userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const keywordByUserId = await dictionaryProvider.retrieveKeyword(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, keywordByUserId));
};

/**
 *  * API No. 2
 * API Name : 유저 검색기록 db에 저장하기
 * [POST] /app/dictionary/usersearch
 */
exports.postSearchList = async function (req, res) {
    /**
     * Path Variable: userId, search
     */
    const userIdFromJWT = req.decoded.userId;
    const search = req.query.search;

    if (!userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if (!search) return res.send(errResponse(baseResponse.DICTIONARY_SEARCH_EMPTY));

    const postSearchByUserId = await dictionaryProvider.putSearch(search, userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, postSearchByUserId));
};

/**
 *  * API No. 3
 * API Name : 사 검색하면 사 들어간 운동 모두 조회하기
 * [POST] /app/dictionary/searchexercise
 */
exports.postSearchName = async function (req, res) {
    /**
     * Path Variable: search
     */
    const search = req.query.search;

    if (!search) return res.send(errResponse(baseResponse.DICTIONARY_SEARCH_EMPTY));

    const postSearch = await dictionaryProvider.dictSearch(search);
    return res.send(response(baseResponse.SUCCESS, postSearch));
};

/**
 *  * API No. 4
 * API Name : parts 받아서 그 parts에 포함된 모든 운동 정보(name, muscle, equipment, time, calorie) 조회
 * [GET] /app/dictionary/exerciseinfo
 */
exports.getInformationByparts = async function (req, res) {
    console.log("1");
    /**
     * Path Variable: parts(healthCategory Table)
     */
    const parts = req.query.parts;

    if (!parts) return res.send(errResponse(baseResponse.DICTIONARY_PARTS_EMPTY));

    const exerciseInformationByParts = await dictionaryProvider.retrieveInformation(parts);
    return res.send(response(baseResponse.SUCCESS, exerciseInformationByParts));
};


/**
 *  * API No. 5
 * API Name : name 받아서 그 운동의 운동방법과 주의사항 반환
 * [GET] /app/dictionary/exercisemethod
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
 *  * API No. 6
 * API Name : name 받아서 그 운동의 채팅 반환
 * [GET] /app/dictionary/exercisechat
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


/**
 * API No. 7
 * API Name : 채팅, 유저닉네임 post
 * [POST] /app/dictionary/chatting
 * body : name(healthCategory Table), userNickname(User Table), text(healthChatting Table)
 */
exports.postChatting = async function(req, res) {
    const userIdFromJWT = req.decoded.userId;
    const { name, text } = req.body;

    // userNickname, text, name가 제공되었는지 체크
    if (!name) return res.send(errResponse(baseResponse.DICTIONARY_NAME_EMPTY));
    if (!text) return res.send(errResponse(baseResponse.DICTIONARY_TEXT_EMPTY));
    
    try {
        // 채팅 생성 호출
        const createChattingResponse = await dictionaryService.createChatting(name, userIdFromJWT, text);
        
        // 채팅 생성 성공 응답
        return res.send(response(baseResponse.SUCCESS, createChattingResponse));
    } catch (error) {
        logger.error(`채팅 post api error: ${error.message}`);
        return res.send(errResponse(baseResponse.SERVER_ERROR));
    }
};


/**
 * API No. 8
 * API Name : 채팅 삭제(healthChatting status 컬럼 0 -> 1)
 * [DELETE] /app/dictionary/deleteChatt
 * path variable : userId
 * body : healthChattingIdx
 */
exports.deleteChatt = async function (req, res) {
    // jwt - userId, path variable :userId
    //app/dictionary/exercisechat에서 get한 healthChattingIdx params로 받아야함.
    const userIdFromJWT = req.decoded.userId;
    const healthChattingIdx = req.body.healthChattingIdx;
    if (!healthChattingIdx) return res.send(errResponse(baseResponse.DICTIONARY_HEALTHCHATTINGIDX_EMPTY));

    // 삭제(status 0 -> 1)할 채팅
    const deleteChatt = await dictionaryService.deleteChatt(userIdFromJWT, healthChattingIdx);
    return res.send(deleteChatt);
};


/**
 * API No. 9
 * API Name : 채팅 어디까지 읽었는지 update
 * [PUT] /app/dictionary/chatRead
 * path variable : userId, healthChattingIdx(지금 있는 채팅방의 마지막 채팅의 healthChattingIdx)
 * body : healthChattingIdx
 */
exports.updateChatRead = async function (req, res) {
    // jwt - userId, path variable :userId
    const userIdFromJWT = req.decoded.userId;
    const healthChattingIdx = req.query.healthChattingIdx;

    if (!healthChattingIdx) return res.send(errResponse(baseResponse.DICTIONARY_HEALTHCHATTINGIDX_EMPTY));
    // userChatRead테이블 update
    const updateChatt = await dictionaryProvider.updateChatRead(userIdFromJWT, healthChattingIdx);
    return res.send(updateChatt);
};