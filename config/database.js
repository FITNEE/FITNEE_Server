const mysql = require('mysql2/promise');
const {logger} = require('./winston');

//DB 계정 입력
const pool = mysql.createPool({
    host: 'health-gpt.cuuueh7vuqzb.ap-northeast-2.rds.amazonaws.com',
    user: 'root',
    port: '3306',
    password: 'healthgpt',
    database: 'gpthealthDB',
    timezone: '+09:00',
    multipleStatements: true
});

// const pool = mysql.createPool({
//     host: 'fitneedb.cuuueh7vuqzb.ap-northeast-2.rds.amazonaws.com',
//     user: 'root',
//     port: '3306',
//     password: 'fitnee123',
//     database: 'fitneeDB',
//     multipleStatements: true
// });

module.exports = {
    pool: pool
};