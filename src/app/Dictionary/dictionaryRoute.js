module.exports = function(app){
    const mypage = require('./mypageController');

    // 1. 
    app.get('/app/dictionary', mypage.getExercisedData);

    
};