const {logger} = require("../../../config/winston");
const promotionProvider = require("./promotionProvider");
const promotionService = require("./promotionService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

exports.postPromotion = async function (req, res) {
    /**
     * Body : email, phoneNum
     */
    const email = req.body.email;
    const phoneNum = req.body.phoneNum;

    const responsePostPromotion = await promotionService.insertPromotion(email, phoneNum);

    return res.send(responsePostPromotion)
}