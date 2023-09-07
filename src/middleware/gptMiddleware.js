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
            model: "gpt-3.5-turbo-16k",
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
                9-Dumbbell Fly,
                10-Shoulder Press,
                11-Side Lateral Raise,
                12-Front Dumbbell Raise,
                13-Bent Over Lateral Raise,
                14-Seated Row,
                15-Leg Curl,
                16-Leg Press,
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
                'Title': thisRoutineTitle
                'dayOfWeek'(day of week name): {
                    'target': targetArea,
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
              "Title": "Full Body Workout",
              "Monday": {
                "target": "Chest",
                "content": [
                  {
                    "exerciseId": 1,
                    "exerciseName": "Bench Press",
                    "sets": 3,
                    "reps": 10,
                    "weights": [
                      40,
                      40,
                      40
                    ]
                  },
                  {
                    "exerciseId": 9,
                    "exerciseName": "Dumbbell Fly",
                    "sets": 3,
                    "reps": 12,
                    "weights": [
                      8,
                      8,
                      8
                    ]
                  }
                ]
              },
              "Tuesday": {
                "target": "Back",
                "content": [
                  {
                    "exerciseId": 6,
                    "exerciseName": "Barbell Row",
                    "sets": 3,
                    "reps": 10,
                    "weights": [
                      30,
                      30,
                      30
                    ]
                  },
                  {
                    "exerciseId": 8,
                    "exerciseName": "Dumbbell Row",
                    "sets": 3,
                    "reps": 12,
                    "weights": [
                      10,
                      10,
                      10
                    ]
                  }
                ]
              },
              "Wednesday": {
                "target": "Shoulders",
                "content": [
                  {
                    "exerciseId": 10,
                    "exerciseName": "Shoulder Press",
                    "sets": 3,
                    "reps": 10,
                    "weights": [
                      20,
                      20,
                      20
                    ]
                  },
                  {
                    "exerciseId": 11,
                    "exerciseName": "Side Lateral Raise",
                    "sets": 3,
                    "reps": 12,
                    "weights": [
                      5,
                      5,
                      5
                    ]
                  }
                ]
              },
              "Thursday": {
                "target": "Arms",
                "content": [
                  {
                    "exerciseId": 2,
                    "exerciseName": "Incline Dumbbell Press",
                    "sets": 3,
                    "reps": 10,
                    "weights": [
                      15,
                      15,
                      15
                    ]
                  },
                  {
                    "exerciseId": 19,
                    "exerciseName": "Chest Dips",
                    "sets": 3,
                    "reps": 12
                  }
                ]
              },
              "Friday": {
                "target": "Core",
                "content": [
                  {
                    "exerciseId": 22,
                    "exerciseName": "Front Plank",
                    "sets": 3,
                    "reps": 10
                  },
                  {
                    "exerciseId": 23,
                    "exerciseName": "Side Plank",
                    "sets": 3,
                    "reps": 10
                  }
                ]
              },
              "Saturday": {
                "target": "Lower Body",
                "content": [
                  {
                    "exerciseId": 16,
                    "exerciseName": "Leg Press",
                    "sets": 3,
                    "reps": 10,
                    "weights": [
                      80,
                      80,
                      80
                    ]
                  },
                  {
                    "exerciseId": 15,
                    "exerciseName": "Leg Curl",
                    "sets": 3,
                    "reps": 12,
                    "weights": [
                      20,
                      20,
                      20
                    ]
                  }
                ]
              },
              "Sunday": {
                "target": "Cardio",
                "content": [
                  {
                    "exerciseId": 24,
                    "exerciseName": "Running",
                    "sets": 1,
                    "reps": 5
                  },
                  {
                    "exerciseId": 25,
                    "exerciseName": "Cycling",
                    "sets": 1,
                    "reps": 5
                  }
                ]
              }
            },
            {
              "Title": "Advanced Upper Body Workout",
              "Monday": {
                "target": "Chest",
                "content": [
                  {
                    "exerciseId": 1,
                    "exerciseName": "Bench Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      50,
                      60,
                      70,
                      80
                    ]
                  },
                  {
                    "exerciseId": 3,
                    "exerciseName": "Chest Press Machine",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  }
                ]
              },
              "Tuesday": {
                "target": "Back",
                "content": [
                  {
                    "exerciseId": 6,
                    "exerciseName": "Barbell Row",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  },
                  {
                    "exerciseId": 5,
                    "exerciseName": "Lat Pulldown",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  }
                ]
              },
              "Wednesday": {
                "target": "Shoulders",
                "content": [
                  {
                    "exerciseId": 10,
                    "exerciseName": "Shoulder Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      30,
                      40,
                      50,
                      60
                    ]
                  },
                  {
                    "exerciseId": 12,
                    "exerciseName": "Front Dumbbell Raise",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      10,
                      15,
                      20,
                      25
                    ]
                  }
                ]
              },
              "Thursday": {
                "target": "Arms",
                "content": [
                  {
                    "exerciseId": 19,
                    "exerciseName": "Chest Dips",
                    "sets": 4,
                    "reps": 8
                  },
                  {
                    "exerciseId": 20,
                    "exerciseName": "Pull Ups",
                    "sets": 4,
                    "reps": 10
                  }
                ]
              },
              "Friday": {
                "target": "Core",
                "content": [
                  {
                    "exerciseId": 22,
                    "exerciseName": "Front Plank",
                    "sets": 4,
                    "reps": 20
                  },
                  {
                    "exerciseId": 23,
                    "exerciseName": "Side Plank",
                    "sets": 4,
                    "reps": 20
                  }
                ]
              },
              "Saturday": {
                "target": "Lower Body",
                "content": [
                  {
                    "exerciseId": 16,
                    "exerciseName": "Leg Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      100,
                      120,
                      140,
                      160
                    ]
                  },
                  {
                    "exerciseId": 17,
                    "exerciseName": "Hip Thrust",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      60,
                      80,
                      100
                    ]
                  }
                ]
              },
              "Sunday": {
              "target": "Cardio",
              "content": [
                  {
                    "exerciseId": 24,
                    "exerciseName": "Running",
                    "sets": 1,
                    "reps": 6
                  },
                  {
                    "exerciseId": 25,
                    "exerciseName": "Cycling",
                    "sets": 1,
                    "reps": 6
                  }
                ]
              }
            },
            {
              "Title": "Advanced Full Body Workout",
              "Monday": {
                "target": "Chest",
                "content": [
                  {
                    "exerciseId": 1,
                    "exerciseName": "Bench Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      50,
                      60,
                      70,
                      80
                    ]
                  },
                  {
                    "exerciseId": 3,
                    "exerciseName": "Chest Press Machine",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  }
                ]
              },
              "Tuesday": {
                "target": "Back",
                "content": [
                  {
                    "exerciseId": 6,
                    "exerciseName": "Barbell Row",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  },
                  {
                    "exerciseId": 5,
                    "exerciseName": "Lat Pulldown",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      50,
                      60,
                      70
                    ]
                  }
                ]
              },
              "Wednesday": {
                "target": "Shoulders",
                "content": [
                  {
                    "exerciseId": 10,
                    "exerciseName": "Shoulder Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      30,
                      40,
                      50,
                      60
                    ]
                  },
                  {
                    "exerciseId": 12,
                    "exerciseName": "Front Dumbbell Raise",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      10,
                      15,
                      20,
                      25
                    ]
                  }
                ]
              },
              "Thursday": {
                "target": "Arms",
                "content": [
                  {
                    "exerciseId": 19,
                    "exerciseName": "Chest Dips",
                    "sets": 4,
                    "reps": 8
                  },
                  {
                    "exerciseId": 20,
                    "exerciseName": "Pull Ups",
                    "sets": 4,
                    "reps": 10
                  }
                ]
              },
              "Friday": {
                "target": "Core",
                "content": [
                  {
                    "exerciseId": 22,
                    "exerciseName": "Front Plank",
                    "sets": 4,
                    "reps": 20
                  },
                  {
                    "exerciseId": 23,
                    "exerciseName": "Side Plank",
                    "sets": 4,
                    "reps": 20
                  }
                ]
              },
              "Saturday": {
                "target": "Lower Body",
                "content": [
                  {
                    "exerciseId": 16,
                    "exerciseName": "Leg Press",
                    "sets": 4,
                    "reps": 8,
                    "weights": [
                      100,
                      120,
                      140,
                      160
                    ]
                  },
                  {
                    "exerciseId": 17,
                    "exerciseName": "Hip Thrust",
                    "sets": 4,
                    "reps": 10,
                    "weights": [
                      40,
                      60,
                      80,
                      100
                    ]
                  }
                ]
              },
              "Sunday": {
                "target": "Cardio",
                "content": [
                  {
                    "exerciseId": 24,
                    "exerciseName": "Running",
                    "sets": 1,
                    "reps": 6
                  },
                  {
                    "exerciseId": 25,
                    "exerciseName": "Cycling",
                    "sets": 1,
                    "reps": 6
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