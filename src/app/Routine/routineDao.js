// 마이 루틴 조희
async function selectMyRoutine(connection, userId) {
    const selectMyRoutineQuery = `
                  SELECT gptRoutineIdx, target
                  FROM myRoutine
                  WHERE userId = ?;
                  `;
    const [myRoutines] = await connection.query(selectMyRoutineQuery, userId);
    return myRoutines;
}

// 유명 루틴 조회
async function selectFamousRoutine(connection) {
    const selectFamousRoutineQuery = `
                  SELECT trainerName, healthCategoryIdx, routineUrl
                  FROM famousRoutine;
                  `;
    const [famousRoutines] = await connection.query(selectFamousRoutineQuery);
    return famousRoutines;
}
  
module.exports = {
    selectMyRoutine,
    selectFamousRoutine,
};