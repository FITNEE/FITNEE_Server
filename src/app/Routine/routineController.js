const {logger} = require("../../../config/winston");
const userProvider = require("./routineProvider");
const userService = require("./routineService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API Name : 루틴 등록 API
 * [POST] /app/routine
 */

/**
 * API Name : 루틴 조회 API
 * [GET] /app/routine
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API Name : 루틴 수정 API
 * [PUT] /app/routine
 */

/**
 * API Name : 루틴 삭제 API
 * [DELETE] /app/routine
 */