const express = require('./config/express');
const {logger} = require('./config/winston');

const api = require("./src/app/User/userRoute")


const { swaggerUi, specs } = require("./swagger/swagger")

const app = express()

app.use("/api", api)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

/**
 * 파라미터 변수 뜻
 * req : request 요청
 * res : response 응답
 */

/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

const port = 3000;
app.listen(port, () => {
    logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
});