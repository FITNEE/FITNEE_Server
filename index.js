const express = require('./config/express');
const {logger} = require('./config/winston');
const cookieParser = require('cookie-parser')
const { swaggerUi, specs } = require("./swagger/swagger")

const userRoute = require('./src/app/User/userRoute')

const app = express()

// api 실행
app.use("/", userRoute)

app.use(cookieParser())
app.use("/", swaggerUi.serve, swaggerUi.setup(specs))

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} https://gpthealth.shop/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

const port = 3000;
app.listen(port, () => {
    logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
});