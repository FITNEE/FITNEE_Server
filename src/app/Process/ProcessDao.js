const lodash = require('lodash');

// 운동 전 / 세트, 무게, 횟수 (Detail) 조회
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

// 운동 중 / 세트, 무게, 횟수 (Detail) 조회
async function selectProcessDetail(connection, routineIdx) {
    const selectRoutineQuery = `
        SELECT detailIdx0, detailIdx1, detailIdx2, detailIdx3, detailIdx4, detailIdx5, detailIdx6, detailIdx7, detailIdx8, detailIdx9
        FROM routine
        WHERE status = 0 AND routineIdx = ?
    `;

    const [[routine]] = await connection.query(selectRoutineQuery, routineIdx);
    if (!routine) return [];

    const routine_list = [];
    for (let i = 0; i < 10; i++) {
        const detailIdxValue = routine[`detailIdx${i}`];
        if (detailIdxValue !== null && detailIdxValue > 0) {
            routine_list.push(detailIdxValue);
        }
    }

    const result = [];
    for (const detailIdxValue of routine_list) {
        const selectRoutineDetailQuery = `
            SELECT routineDetailIdx, rep${detailIdxValue} AS rep, weight${detailIdxValue} AS weight
            FROM routineDetail
            WHERE status = 0 AND routineDetailIdx = ? AND rep${detailIdxValue} IS NOT NULL
        `;
        const [routineDetailRows] = await connection.query(selectRoutineDetailQuery, detailIdxValue);

        if (routineDetailRows.length > 0) {
            const existingDetailIdx = result.findIndex(item => item.routineDetailIdx === routineDetailRows[0].routineDetailIdx);
            if (existingDetailIdx === -1) {
                result.push({
                    routineDetailIdx: routineDetailRows[0].routineDetailIdx,
                    sets: routineDetailRows.map((row, index) => ({
                        set: index + 1, // Correct the set number calculation here
                        [`rep${detailIdxValue}`]: row.rep,
                        [`weight${detailIdxValue}`]: row.weight,
                    })),
                });
            } else {
                result[existingDetailIdx].sets.push(...routineDetailRows.map((row, index) => ({
                    set: index + 1, // Correct the set number calculation here
                    [`rep${detailIdxValue}`]: row.rep,
                    [`weight${detailIdxValue}`]: row.weight,
                })));
            }
        }
    }

    return result;
}









module.exports = {
    selectBeforeProcessDetail,
    selectProcessDetail,
};