exports.searchExercise = async function (month) {
    const connection = await pool.getConnection(async (conn) => conn);
    const myExerciseResult = await mypageDai.selectMyCalendar(connection, month);
    connection.release();

    return myExerciseResult;
};