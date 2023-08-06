const {Configuration, OpenAIApi} = require('openai');
const secret = require('../../config/secret');
const { errResponse } = require("../../config/response")
const baseResponse = require("../../config/baseResponseStatus");

const gptMiddleware = async function (req, res, next)  {
    try {
        req.gpt = {};

        const configuration = new Configuration ({
            organization: secret.openaiOrganization,
            apiKey: secret.openaiSecret,
        });
        req.gpt.openai = new OpenAIApi(configuration);

        req.gpt.chatCompletion = {
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
                {role: "user", content: ''}
            ],
        };

        req.gpt.chatContent = `

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
            }(This object must include all requested days of the week.)
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
                }
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
                }
            },
            {
                'Title': "기초 체력 운동",
                'Thursday': {
                    'target': '어깨',
                    'content': [
                        {
                            "exerciseId": 6,
                            "exerciseName": "Barbell Row",
                            "sets": 3,
                            "reps": 12,
                            "weights": [25, 30, 35]
                        },
                        {
                            "exerciseId": 8,
                            "exerciseName": "Dumbbell Row",
                            "sets": 3,
                            "reps": 12,
                            "weights": [10, 10, 15]
                        }
                    ]
                }
                'Sunday': {
                    'target': '코어',
                    'content': [
                        {
                            "exerciseId": 21,
                            "exerciseName": "Push Up",
                            "sets": 3,
                            "reps": 10
                        },
                        {
                            "exerciseId": 15,
                            "exerciseName": "Leg Press",
                            "sets": 3,
                            "reps": 12,
                            "weights": [40, 50, 60]
                        },
                        {
                            "exerciseId": 17,
                            "exerciseName": "Hip Thrust",
                            "sets": 3,
                            "reps": 10,
                            "weights": [40, 50, 60]
                        }
                    ]
                }
            }
        ]
        Never Explain.
        `;
        next();
    } catch (err) {
        res.send(errResponse(baseResponse.GPT_ERROR));
    }
};

module.exports = gptMiddleware;