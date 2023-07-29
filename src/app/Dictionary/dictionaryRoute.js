module.exports = function(app){
    const mypage = require('./dictionaryController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 
    app.get('/app/dictionary', mypage.getKeywordByIdx);

    
};