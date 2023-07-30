module.exports = function(app){
    const mypage = require('./dictionaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 
    app.get('/app/dictionary', mypage.getKeywordByIdx);

    // 2.
    app.get('/app/exerciseinfo', mypage.getInformationByparts);

    // 3.
    app.get('/app/exercisemethod', mypage.getMethodByName);

    // 4.
    app.get('/app/exercisechat', mypage.getChattingByName);
};