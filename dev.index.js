const express = require('./src/dev/serverExpress');
const {logger} = require('./config/winston');

const port = 3001;
express().listen(port, () => {
    logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
});