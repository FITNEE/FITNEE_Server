const express = require('express');
const compression = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

var cors = require('cors');

module.exports = function () {
    const app = express();

    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());

    app.use(cookieParser());

    app.use(cors());
    // app.use(express.static(process.cwd() + '/public'));

    /* App (Android, iOS) */
    // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.
    const userRoute = require('../src/app/User/userRoute');
    const routineRoute = require('../src/app/Routine/routineRoute');
    const mypageRoute = require('../src/app/Mypage/mypageRoute');
    const dictionaryRoute = require('../src/app/Dictionary/dictionaryRoute');
    const processRoute = require('../src/app/Process/processRoute');
    
    app.use('/app/user', userRoute);
    app.use('/app/routine', routineRoute);
    app.use('/app/mypage', mypageRoute);
    app.use('/app/dictionary', dictionaryRoute);
    // app.use('/app/process', processRoute);
    
    const {swaggerUi, specs} = require("./swagger");
    app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

    return app;
};