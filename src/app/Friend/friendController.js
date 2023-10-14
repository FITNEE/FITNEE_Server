const {logger} = require("../../../config/winston");
const friendProvider = require("./friendProvider");
const friendService = require("./friendService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

// FCM
const admin = require('../../../config/pushConn');

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
exports.refuseFriend = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT
     */
    const userIdxFromJWT = req.decoded.userIdx;
    const friendListIdx = req.query.friendListIdx;

    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    if (!friendListIdx) return res.send(errResponse(baseResponse.MYPAGE_CONTENT_EMPTY))

    const refuseFriend = await friendService.refuseFriend(userIdxFromJWT, friendListIdx);
    return res.send(response(baseResponse.SUCCESS, refuseFriend));
};


/**
 *  * API No. 5
 * API Name : 친구 삭제기능(이미 친구인 경우 삭제 / 별도 차단은X)
 * [DELETE] /app/friend/delete
 */
exports.deleteFriend = async function (req, res) {
    /**
     * Path Variable: userIdxFromJWT, friendUserIdx
     */
    const userIdxFromJWT = req.decoded.userIdx;
    const friendUserIdx = req.query.friendUserIdx;

    if (!userIdxFromJWT) return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
    if (!friendUserIdx) return res.send(errResponse(baseResponse.MYPAGE_FRIENDIDX_EMPTY))

    const deleteFriend = await friendService.deleteFriend(userIdxFromJWT, friendUserIdx);
    return res.send(response(baseResponse.SUCCESS, deleteFriend));
};


/**
 *  * API No. 6
 * API Name : 친구가 오늘 운동 했는지 이름 옆에 파란점으로 표시(운동을 안했다면 회색점)
 * -> 파란점일때 터치하면 api no.6.1이 나오게
 * [GET] /app/friend/friendStatus
 */


/**
 *  * API No. 6.1
 * API Name : 친구의 운동정보 (오늘 어떤 운동 했는지 get)
 * [GET] /app/friend/friendExercise
 */


/**
 *  * API No. 7
 * API Name : 칼로리 기준으로 친구들 순위 매기기(1~3등정도만)
 * [GET] /app/friend/rank
 */


/**
 *  * API No. 8
 * API Name : pushAlarm test api
 * [GET] /app/friend/push
 */
exports.pushAlarm = async function (req, res){


    const num = req.query.num;
    //디바이스의 토큰 값
    let deviceToken =`eUcJdj1-SW6odpyv04OznB:APA91bEIcO7ACqOtAnp1MWNrpeqFibVWT7C9Irm8Ja9fsf6FJ69A0G3bjTWLyeg18r9e1FKWQK7BlzJJzCZbVRDqbO64bFNknLOGzKkR62TUFqdZX7k-UQPX--vozCWe3SCD8kooOAGJ`

    let message = {
        notification: {
            title: '테스트 알림 발송',
            body: 'FITNEE 테스트 알림입니다.',
        },
        token: deviceToken,
    }
   
    admin
        .messaging()
        .send(message)
        .then(function (response) {
            console.log('Successfully sent message: : ', response)
            return res.status(200).json({success : true})
        })
        .catch(function (err) {
            console.log('Error Sending message! : ', err)
            return res.status(400).json({success : false})
    });
}


////////// 2.
// const admin = require('../../../config/pushConn');

// exports.pushAlarm = async (req, res) => {
// 	const parameters = {
//     	"notice_num" : req.query.num
//         }
//    	//const result = await friendDAO.read_notice(parameters);
    
//     // fcm send message 
//     let message = {
//     	token : 'f2GmDOppTJ015dXkvmX_bL:APA91bFpbuNWAdJMUHYnIn3i3Yog2MUxSH1VIp-QYJxj_6nSOfuLw10X5C48FZ-oogzHr9ulUeblouqSP7PNNSsJqbellkSzVgmhkjXWRRRRrA3eoe28KRzF92NDFhhGJYyMbXZLYEgC',
//         notification : {
//         // 보내는 위치 알려주기 위해 body에 Notice 넣어줌
//         	body : "Notice"
//             },
//        	// data : {
//         // 	title : result[0].notice_title,
//         //     body : result[0].notice_content
//         //     },
//      	android : {
// 			priority : "high",
//             },
//      	}
        
//         admin.messaging()
//         	.send(message)
//             .then((res) => {
//             	console.log('Success sent message : ', res);
//                 res.send(res);
//           	})
//             .catch((err) => {
//             	console.log('Error Sending message !! : ', err);
//                 res.send(err);
//           	})
// };


// //// 3.
// exports.pushAlarm = async function (req, res) {
//     const num = req.query.num;
//     // 디바이스의 유효한 토큰 값 사용
//     const deviceToken = 'f5fCKhYLT-6Q7tanRU1VFI:APA91bHQQ07bYv27AEMH4zhpQ1gKDX-YFDOjkpUL6bBM5d7zUhmrDOWWv5MIYIDgDFNUzeXAfsnDBS7-NtGqCfRKwxZBm8Zf84m84ado_Gtrs10Vi_qMmeK8PPLK7WI4ShUAkkXsgcWt';
  
//     const message = {
//       notification: {
//         title: '테스트 알림 발송',
//         body: 'FITNEE 테스트 알림입니다.',
//       },
//       token: deviceToken,
//     };
  
//     try {
//       const response = await admin.messaging().send(message);
//       console.log('Successfully sent message:', response);
//       return res.status(200).json({ success: true });
//     } catch (err) {
//       console.error('Error Sending message:', err);
//       return res.status(400).json({ success: false });
//     }
//   };
  