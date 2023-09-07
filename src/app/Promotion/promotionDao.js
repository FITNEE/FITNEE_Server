const { response } = require('express');
const { exceptions } = require('winston');

async function insertPromotion(connection, email, phoneNum) {
    const insertPromotionQuery = `
                      INSERT INTO promotion(email, phoneNumber)
                      VALUE(?, ?)
                      `;

    await connection.query(insertPromotionQuery, [email, phoneNum]);

    return ;
}