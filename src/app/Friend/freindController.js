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
 * [GET] /app/friend
 */
exports.getFriendByIdx = async function (req, res) {
    /**
     * Path Variable: jwt(userId)
     */
    const userIdFromJWT = req.decoded.userId;
    console.log(req.decoded.userIdx);

    if (!userIdFromJWT) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const friendByUserId = await friendProvider.searchFriendList(userIdFromJWT);
    return res.send(response(baseResponse.SUCCESS, friendByUserId));
};


/**
 *  * API No. 2
 * API Name : 유저 닉네임 검색 -> 연관 닉네임 가진 유저 userIdx, userNickname 반환
 * [POST] /app/friend/searchUser
 */
exports.searchUser = async function (req, res) {
    /**
     * Path Variable: search
     */
    const search = req.query.search;

    if (!search) return res.send(errResponse(baseResponse.DICTIONARY_SEARCH_EMPTY));

    const postSearch = await friendProvider.searchFriend(search);
    return res.send(response(baseResponse.SUCCESS, postSearch));
};


/**
 *  * API No. 3
 * API Name : 친구 신청(추가)기능 (내 입장에선 보냄 상대 입장에서는 받음)
 * [POST] /app/friend/addFriend
 */
exports.addFriend = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT, friendIdx
     */
    const userIdxFromJWT = req.decoded.userIdx;
    const friendIdx = req.body.friendIdx;
    
    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    const postUserInfo = await friendService.friendAdd(userIdxFromJWT, friendIdx);
    return res.send(response(baseResponse.SUCCESS, postUserInfo));
};

/**
 *  * API No. 3.1
 * API Name : 보낸 친구신청 목록 불러오기 -> toUserIdx, toUserIdx의 userNickname get
 * [GET] /app/friend/addFriendList
 */
exports.addFriendList = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT
     */
    const userIdxFromJWT = req.decoded.userIdx;
    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    const addFriendInfo = await friendProvider.addFriendList(userIdxFromJWT);
    return res.send(response(baseResponse.SUCCESS, addFriendInfo));
};


/**
 *  * API No. 3.2
 * API Name : 보낸 친구신청 취소하기 -> friendListIdx get
 * [DELETE] /app/friend/cancelAdd
 */
exports.cancelAdd = async function (req, res) {
    /**
     * Path Variable: friendListIdx(api no.3.1에서 get했던 Idx), userIdxFromJWT
     */
    const friendListIdx = req.query.friendListIdx;
    const userIdxFromJWT = req.decoded.userIdx;
    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    const deleteAddFriend = await friendService.deleteAddFriendList(friendListIdx, userIdxFromJWT);
    return res.send(response(baseResponse.SUCCESS, deleteAddFriend));
};


/**
 *  * API No. 4
 * API Name : 받은 친구신청 목록 불러오기 -> friendListIdx get
 * [GET] /app/friend/getReceiveList
 */
exports.getReceiveList = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT
     */
    const userIdxFromJWT = req.decoded.userIdx;
    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));

    const receivedList = await friendProvider.getReceiveList(userIdxFromJWT);
    return res.send(response(baseResponse.SUCCESS, receivedList));
};


/**
 *  * API No. 4.1
 * API Name : 친구 추가(신청) 수락 기능(friendList.status 0 -> 1)
 * [PUT] /app/friend/accept
 */
exports.acceptFriend = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT
     */
    const userIdxFromJWT = req.decoded.userIdx;
    const friendListIdx = req.query.friendListIdx;

    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    if (!friendListIdx) return res.send(errResponse(baseResponse.MYPAGE_CONTENT_EMPTY))

    const acceptFriend = await friendService.receiveFriend(userIdxFromJWT, friendListIdx);
    return res.send(response(baseResponse.SUCCESS, acceptFriend));
};




/**
 *  * API No. 4.2
 * API Name : 친구 추가(신청) 거부 기능(delete friendList column)
 * [DELETE] /app/friend/refuse
 */


/**
 *  * API No. 5
 * API Name : 친구 삭제기능(이미 친구인 경우 삭제 / 별도 차단은X)
 * [DELETE] /app/friend/delete
 */


/**
 *  * API No. 6
 * API Name : 친구가 오늘 운동 했는지 이름 옆에 파란점으로 표시(운동을 안했다면 회색점)
 * -> 파란점일때 터치하면 api no.7이 나오게
 * [GET] /app/friend/friendStatus
 */



/**
 *  * API No. 6.1
 * API Name : 친구의 운동정보(오늘 어떤 운동 했는지 get)
 * [GET] /app/friend/friendExercise
 */