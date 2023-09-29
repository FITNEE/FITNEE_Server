const {logger} = require("../../../config/winston");
const friendProvider = require("./friendProvider");
const friendService = require("./friendService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");


/**
 *  * API No. 1
 * API Name : 내 친구목록 불러오기
 * [GET] /app/freind
 */
exports.getFriendByIdx = async function (req, res) {

    /**
     * Path Variable: userIdx
     */
    const userIdFromJWT = req.decoded.userId;

    if (!userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const friendByUserId = await friendProvider.searchFriendList(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, friendByUserId));
};



/**
 *  * API No. 2
 * API Name : 유저 검색
 * [GET] /app/freind/search
 */


/**
 *  * API No. 3
 * API Name : 친구 추가(신청)기능 (내 입장에선 보냄 상대 입장에서는 받음)
 * [POST] /app/freind/add
 */

/**
 *  * API No. 4
 * API Name : 친구 추가(신청) 수락 기능
 * [POST] /app/freind/accept
 */

/**
 *  * API No. 5
 * API Name : 친구 추가(신청) 거부 기능
 * [POST] /app/freind/refuse
 */


/**
 *  * API No. 6
 * API Name : 친구 삭제기능(이미 친구인 경우 삭제 / 별도 차단은X)
 * [DELETE] /app/freind/delete
 */


/**
 *  * API No. 7
 * API Name : 친구의 운동정보(오늘 어떤 운동 했는지 get)
 * [GET] /app/freind/friendExercise
 */


/**
 *  * API No. 8
 * API Name : 친구가 오늘 운동 했는지 이름 옆에 파란점으로 표시(운동을 안했다면 회색점)
 * -> 파란점일때 터치하면 7번이 나오면 될듯
 * [GET] /app/freind/friendStatus
 */