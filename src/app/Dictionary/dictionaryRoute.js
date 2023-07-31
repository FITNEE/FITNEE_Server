module.exports = function(app){
    const mypage = require('./dictionaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 
    app.get('/app/dictionary', mypage.getKeywordByIdx);

    // 2.
    app.get('/app/dictionary/exerciseinfo', mypage.getInformationByparts);

    // 3.
    app.get('/app/dictionary/exercisemethod', mypage.getMethodByName);

    // 4.
    app.get('/app/dictionary/exercisechat', mypage.getChattingByName);

    // 5.
    app.post('/app/dictionary/chatting', mypage.postChatting);
};