const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "healthGPT",
      description:
        "test swagger",
    },
    servers: [
      {
        url: "https://gpthealth.shop/", // 요청 URL
      },
    ],
  },
  apis: ["./src/app/*.js", "./src/app/User/*.js"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }