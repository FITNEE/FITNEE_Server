const {logger} = require("../../../config/winston");
const friendProvider = require("./friendProvider");
const friendService = require("./friendService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 *  * API No. 1
 * API Name : 친구 추가기능
 * [POST] /app/freind
 */

/**
 *  * API No. 2
 * API Name : 친구 삭제기능
 * [DELETE] /app/freind
 */