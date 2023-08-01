const express = require('./config/express');
const {logger} = require('./config/winston');
// const cookieParser = require('cookie-parser');
// const { swaggerUi, specs } = require("./swagger/swagger");

// const userRoute = require('./src/app/User/userRoute')

/**
 * @path {GET} https://gpthealth.shop/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

const port = 3000;
express().listen(port, () => {
    logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
});