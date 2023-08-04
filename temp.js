const responseContent = [
        {
            'Title': "등 운동",
            'Monday': {
                'target': '등',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 40, 50]
                    }
                ]
            },
            'Wednesday': {
                'target': '등',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [35, 40, 45]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [35, 45, 50]
                    }
                ]
            },
            'Friday': {
                'target': '등',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [40, 45, 50]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [40, 50, 55]
                    }
                ]
            }
        },
        {
            'Title': "하체 운동",
            'Monday': {
                'target': '하체',
                'content': [
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [60, 80, 100]
                    }
                ]
            },
            'Wednesday': {
                'target': '하체',
                'content': [
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [80, 100, 120]
                    }
                ]
            },
            'Friday': {
                'target': '하체',
                'content': [
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [100, 120, 140]
                    }
                ]
            }
        },
        {
            'Title': "전신 운동",
            'Monday': {
                'target': '전신',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 40, 50]
                    },
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [20, 25, 30]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [60, 80, 100]
                    }
                ]
            },
            'Wednesday': {
                'target': '전신',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [35, 40, 45]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [35, 45, 50]
                    },
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [25, 30, 35]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [80, 100, 120]
                    }
                ]
            },
            'Friday': {
                'target': '전신',
                'content': [
                    {
                        'exerciseId': 13,
                        'exerciseName': 'Seated Row',
                        'sets': 3,
                        'reps': 12,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 5,
                        'exerciseName': 'Lat Pull down',
                        'sets': 3,
                        'reps': 10,
                        'weights': [40, 45, 50]
                    },
                    {
                        'exerciseId': 6,
                        'exerciseName': 'Barbell Row',
                        'sets': 3,
                        'reps': 10,
                        'weights': [40, 50, 55]
                    },
                    {
                        'exerciseId': 4,
                        'exerciseName': 'Leg Extension',
                        'sets': 3,
                        'reps': 12,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 14,
                        'exerciseName': 'Leg Curl',
                        'sets': 3,
                        'reps': 10,
                        'weights': [30, 35, 40]
                    },
                    {
                        'exerciseId': 15,
                        'exerciseName': 'Leg Press',
                        'sets': 3,
                        'reps': 10,
                        'weights': [100, 120, 140]
                    }
                ]
            }
        }
    ];


const responseRoutines = [];
for (var i=0; i<3; i++) {
    const responseKeys = Object.keys(responseContent[i]);
    const responseValues = Object.values(responseContent[i]);
    const tempRoutineCalendar = {
        id : i+1,
        title : responseContent[i].Title,
        item : []
    };

    for (var j=0; j<responseKeys.length-1; j++) {
        const recRoutine = responseValues[j+1].content;
        const resRoutine = {
            routineIdx : 0,
            day : responseKeys[j+1],
            parts : responseValues[j+1].target,
            exercises : []
        };
        const tempRoutine = {};

        for (var k=0; k<recRoutine.length; k++) {
            const recDetail = recRoutine[k];
            resRoutine.exercises.push({
                healthCategoryIdx : recDetail.exerciseId,
                name : "ㅁㄴㅇㄹ",
                set : recDetail.sets
            });

            const tempRoutineDetail = {
                healthCategoryIdx : recDetail.exerciseId
            };
            for (var l=0; l<recDetail.sets; l++) {
                tempRoutineDetail['rep'+String(l)] = recDetail.reps;
                if (recDetail.weights) {
                    tempRoutineDetail['weight'+String(l)] = recDetail.weights[l];
                }
            };

            // const tempRoutineDetailQuery = `
            //                       INSERT INTO routineDetail
            //                       SET ?;
            //                       SELECT LAST_INSERT_ID();
            //                       `;
            // const [reponseTempRDIdx] = await connection.query(tempRoutineDetailQuery, tempRoutineDetail);
            // tempRoutine['detailIdx'+String(k)] = reponseTempRDIdx[1][0]['LAST_INSERT_ID()'];
        };

        // const tempRoutineQuery = `
        //                   INSERT INTO routine
        //                   SET ?;
        //                   SELECT LAST_INSERT_ID();
        //                   `;
        // const [responseTempRIdx] = await connection.query(tempRoutineQuery, tempRoutine);
        // resRoutine.id = responseTempRIdx[1][0]['LAST_INSERT_ID()'];

        console.log(tempRoutine);
        tempRoutineCalendar.item.push(resRoutine);
    };
    responseRoutines.push(tempRoutineCalendar);
};

console.log(JSON.stringify(responseRoutines, null, 2));
