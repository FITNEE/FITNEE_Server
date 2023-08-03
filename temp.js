const express = require('express');
const {logger} = require('./config/winston');

const port = 3000;
const temp = express();

temp.get('/a', (req, res) => {
    console.log("ASDF");
    res.sendStatus(200);
})


temp.listen(port, () => {
    logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
});