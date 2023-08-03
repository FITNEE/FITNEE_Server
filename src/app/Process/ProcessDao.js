const lodash = require('lodash');

// 운동 전 Detail 조회
async function selectBeforeProcessDetail(connection, routine_list) {
    if (!routine_list || routine_list.length === 0) {
        return [];
      }
    
      const selectBeforeProcessDetailQuery = `
        SELECT
          routineDetailIdx,
          -- Count non-null data from rep0 to rep9 in routineDetail
          SUM(CASE WHEN rep0 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep1 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep2 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep3 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep4 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep5 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep6 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep7 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep8 IS NOT NULL THEN 1 ELSE 0 END +
            CASE WHEN rep9 IS NOT NULL THEN 1 ELSE 0 END) AS total_not_null_count,
          -- Select rep0 data from routineDetail
          MAX(CASE WHEN rep0 IS NOT NULL THEN rep0 END) AS data_rep0,
          -- Select weight0 data from routineDetail
          MAX(CASE WHEN rep0 IS NOT NULL THEN weight0 END) AS data_weight0
        FROM routineDetail 
        WHERE routineDetailIdx IN (?)
        GROUP BY routineDetailIdx
      `;
    
      const [beforeProcessDetail] = await connection.query(selectBeforeProcessDetailQuery, [routine_list]);
    
      return beforeProcessDetail;
}

// 운동 중 / 세트, 무게, 횟수
async function selectRoutineDetail(connection, routineIdx) {
    const selectRoutineQuery = `
                  SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
                  FROM routine
                  WHERE status = 0 AND routineIdx = ?
                  `;
    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return routine;

    for (var i=0; i<10; i++) {
        const repColumn = `rep${i}`;
        const weightColumn = `weight${i}`

        const selectRoutineDetailQuery = `
            SELECT ${repColumn}, ${weightColumn}
            FROM routineDetail
            WHERE status = 0 AND routineDetailIdx = ?
            `;
        const [[routineDetail]] = await connection.query(selectRoutineDetailQuery, routine['detailIdx'+String(i)]);
    }
    return [routineDetail]
}
  
module.exports = {
    selectBeforeProcessDetail,
    selectRoutineDetail,
};