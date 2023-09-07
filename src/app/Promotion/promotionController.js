const {logger} = require("../../../config/winston");
const promotionProvider = require("./promotionProvider");
const promotionService = require("./promotionService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.postPromotion = async function (req, res) {
    /**
     * Body : email, phoneNum
     */
    const { email, phoneNum } = req.body;
    if (!email) return res.send(errResponse(baseResponse.PROMOTION_EMAIL_NOT_EXIST));
    if (!phoneNum) return res.send(errResponse(baseResponse.PROMOTION_PHONENUM_NOT_EXIST));

    const existCheckNum = await promotionProvider.returnExist(email, phoneNum);
    console.log(existCheckNum);

    // if existCheckNum 1 - 이메일 and 번호 둘다 같은게 있으면 이미 사전예약 했습니다 띄우기
    if (existCheckNum === 1) return res.send(errResponse(baseResponse.PROMOTION_ALREADY_ENTERED));


    // if existCheckNum 2 - 이메일 동일한게 있다면 전화번호 덮어쓰기
    else if (existCheckNum === 2) {
        const responsePostPromotion = await promotionService.changePhoneNum(email, phoneNum);
        return res.send(response(baseResponse.SUCCESS, responsePostPromotion));
    }
    
    // if existCheckNum 3 - 번호 동일한게 있다면 이메일 덮어쓰기
    else if (existCheckNum === 3) {
        const responsePostPromotion = await promotionService.changeEmail(email, phoneNum);
        return res.send(response(baseResponse.SUCCESS, responsePostPromotion));
    }

    // if existCheckNum 4 - 동일한거 없는경우 -> db에 넣기
    else {
        const responsePostPromotion = await promotionService.insertPromotion(email, phoneNum);
        return res.send(response(baseResponse.SUCCESS, responsePostPromotion));
    }
}