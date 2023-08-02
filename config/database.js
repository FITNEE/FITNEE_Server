const mysql = require('mysql2/promise');
const {logger} = require('./winston');

//DB 계정 입력
const pool = mysql.createPool({
    host: 'health-gpt.cuuueh7vuqzb.ap-northeast-2.rds.amazonaws.com',
    user: 'root',
    port: '3306',
    password: 'healthgpt',
    database: 'gpthealthDB',
    multipleStatements: true
});

module.exports = {
    pool: pool
};