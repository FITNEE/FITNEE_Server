const {Configuration, OpenAIApi} = require('openai');
const secret = require("./config/secret");

const configuration = new Configuration({
    organization: secret.openaiOrganization,
    apiKey: secret.openaiSecret,
});
const openai = new OpenAIApi(configuration);

const temp = async function() {
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {role: "system", content: "You're a fitness trainer who recommends exercise routines."},
            {role: "system", content: `
            exerciseId-exerciseName-note(rep of unit),
            1-Bench Press,
            2-Incline Dumbbell Press,
            3-Chest Press Machine,
            4-Leg Extension,
            5-Lat Pull down,
            6-Barbell Row,
            7-Deadlift,
            8-Dumbbell Row,
            9-Shoulder Press,
            10-Side Lateral Raise,
            11-Front Dumbbell Raise,
            12-Bent Over Lateral Raise,
            13-Seated Row,
            14-Leg Curl,
            15-Leg Press,
            16-Bench Fly,
            17-Hip Thrust,
            18-Hip Raise,
            19-Chest Dips,
            20-Pull Up,
            21-Push Up,
            22-Front Plank-(1sec),
            23-Side Plank-(1sec),
            24-Running-(100m),
            25-Cycling-(100m)
            Create a routine with these exercises
            `
            },
            {role: "user", content: `
            I am a male born in 2001, I am 174cm tall and weigh 62kg.
            I think I can lift up to 70kg when I do squats to the maximum.
            I will do chest, back, and lower body exercises at home.
            I'm going to exercise on Monday, Thursday.
            
            Please recommend 3 different routines.
    
            Say only JSON Object format like
            [
                {
                    'Title': thisRoutineTitle(Only Korean)
                    'dayOfWeek'(day of week name): {
                        'target': targetArea(Only Korean),
                        'content': [
                            {
                                'exerciseId': exerciseId,
                                'exerciseName': exerciseName,
                                'sets': numsOfSet(Only Int),
                                'reps': numsOfRep(Only Int),
                                'weights'(If exerciseId is between 19 and 25, that is, bare body exercise, get rid of this.): numsOfWeight(Only List(Integer as many as numsOfSet))
                            }
                        ]
                    }
                }(This object must include all requested days of the weeks. If the request is Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Then should be seven 'dayOfWeek's).
            ](This array must have three elements that are the number of branches of the routine example.)
            In the case of planks, if 1 rep performs 1 second, that is, 10 seconds, using note(rep of unit), rep should be 10.
            In the case of Running and Cycling, if 1 rep performs 100m, that is, 500m, using note(rep of unit), rep should be 5.
    
            example
            [
                {
                    'Title': "전신 근력 운동",
                    'Monday': {
                        'target': '등',
                        'content': [
                            {
                                'exerciseId': 13,
                                'exerciseName': 'Seated Row',
                                'sets': 3,
                                'reps': 12,
                                "weights": [20, 25, 30]
                            },
                            {
                                "exerciseId": 5,
                                "exerciseName": "Lat Pull down",
                                "sets": 3,
                                "reps": 10,
                                "weights": [30, 40, 50]
                            },
                            {
                                "exerciseId": 1,
                                "exerciseName": "Bench Press",
                                "sets": 3,
                                "reps": 10,
                                "weights": [50, 55, 60]
                            },
                            {
                                "exerciseId": 3,
                                "exerciseName": "Chest Press Machine",
                                "sets": 3,
                                "reps": 12,
                                "weights": [30, 35, 40]
                            },
                        ]
                    },
                    'Tuesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Wednesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Thursday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Friday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Saturday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Sunday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    }
                },
                {
                    'Title': "기초 체력 운동",
                    'Monday': {
                        'target': '등',
                        'content': [
                            {
                                'exerciseId': 13,
                                'exerciseName': 'Seated Row',
                                'sets': 3,
                                'reps': 12,
                                "weights": [20, 25, 30]
                            },
                            {
                                "exerciseId": 5,
                                "exerciseName": "Lat Pull down",
                                "sets": 3,
                                "reps": 10,
                                "weights": [30, 40, 50]
                            },
                            {
                                "exerciseId": 1,
                                "exerciseName": "Bench Press",
                                "sets": 3,
                                "reps": 10,
                                "weights": [50, 55, 60]
                            },
                            {
                                "exerciseId": 3,
                                "exerciseName": "Chest Press Machine",
                                "sets": 3,
                                "reps": 12,
                                "weights": [30, 35, 40]
                            },
                        ]
                    },
                    'Tuesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Wednesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Thursday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Friday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Saturday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Sunday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    }
                },
                {
                    'Title': "기초 체력 운동",
                    'Monday': {
                        'target': '등',
                        'content': [
                            {
                                'exerciseId': 13,
                                'exerciseName': 'Seated Row',
                                'sets': 3,
                                'reps': 12,
                                "weights": [20, 25, 30]
                            },
                            {
                                "exerciseId": 5,
                                "exerciseName": "Lat Pull down",
                                "sets": 3,
                                "reps": 10,
                                "weights": [30, 40, 50]
                            },
                            {
                                "exerciseId": 1,
                                "exerciseName": "Bench Press",
                                "sets": 3,
                                "reps": 10,
                                "weights": [50, 55, 60]
                            },
                            {
                                "exerciseId": 3,
                                "exerciseName": "Chest Press Machine",
                                "sets": 3,
                                "reps": 12,
                                "weights": [30, 35, 40]
                            },
                        ]
                    },
                    'Tuesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Wednesday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Thursday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Friday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Saturday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    },
                    'Sunday': {
                        'target': '하체',
                        'content': [
                            {
                                "exerciseId": 4,
                                "exerciseName": "Leg Extension",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              },
                              {
                                "exerciseId": 14,
                                "exerciseName": "Leg Curl",
                                "sets": 3,
                                "reps": 12,
                                "weights": [20, 25, 30]
                              }
                        ]
                    }
                }
            ]
            Never Explain.
            `}
        ],
    });
    console.log(completion.data.choices[0].message.content);
};

temp();