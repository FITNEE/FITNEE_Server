const { response } = require('express');
const { exceptions } = require('winston');


async function checkExist(connection, email, phoneNum) {
    const returnExistQuery = `
        SELECT
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM promotion
                    WHERE email = ? AND phoneNumber = ?
                ) THEN 1 -- 테이블에 이메일 and 번호 둘다 같은게 있으면
                WHEN EXISTS (
                    SELECT 1
                    FROM promotion
                    WHERE email = ?
                ) THEN 2 -- 테이블에 이메일 동일한게 있다면
                WHEN EXISTS (
                    SELECT 1
                    FROM promotion
                    WHERE phoneNumber = ?
                ) THEN 3 -- 테이블에 번호 동일한게 있다면
                ELSE 4 -- 테이블에 동일한거 없는경우
            END AS result;
    `;

    const [result] = await connection.query(returnExistQuery, [email, phoneNum, email, phoneNum]);
    return result[0].result;
}

async function changePhoneNum(connection, email, phoneNum) {
    const changePromotionQuery = `
        UPDATE promotion
        SET phoneNumber = ?
        WHERE email = ?;
    `;
    await connection.query(changePromotionQuery, [phoneNum, email]);

    return;
}

//동일한 전화번호 있으면 이메일 덮어쓰기
async function changeEmail(connection, email, phoneNum) {
    const changePromotionQuery = `
        UPDATE promotion
        SET email = ?
        WHERE phoneNumber = ?;
    `;
    await connection.query(changePromotionQuery, [email, phoneNum]);

    return ;
}


async function insertPromotion(connection, email, phoneNum) {
    const insertPromotionQuery = `
                      INSERT INTO promotion(email, phoneNumber)
                      VALUE(?, ?)
                      `;

    await connection.query(insertPromotionQuery, [email, phoneNum]);

    return ;
}

module.exports = {
    checkExist,
    changePhoneNum,
    changeEmail,
    insertPromotion
};