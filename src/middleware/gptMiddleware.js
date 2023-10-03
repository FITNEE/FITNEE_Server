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
                {role: "system", content: `exerciseId-exerciseName-note(rep of unit),\n`
                + `1-Bench Press, 2-Incline Dumbbell Press, 3-Chest Press Machine, 4-Leg Extension, 5-Lat Pull down, 6-Barbell Row, 7-Deadlift, 8-Dumbbell Row,9-Dumbbell Fly, 10-Shoulder Press, 11-Side Lateral Raise, 12-Front Dumbbell Raise,13-Bent Over Lateral Raise, 14-Seated Row, 15-Leg Curl, 16-Leg Press, 17-Hip Thrust, 18-Hip Raise, 19-Chest Dips, 20-Pull Up, 21-Push Up, 22-Front Plank-(1sec), 23-Side Plank-(1sec), 24-Running-(100m), 25-Cycling-(100m)\n`
                + `Create a routine with these exercises`
                },
                {role: "user", content: ''}
            ],
        };

        req.gpt.chatContent = `
        Say only JSON Object format like
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
        In the case of planks, if 1 rep performs 1 second, that is, 10 seconds, using note(rep of unit), rep should be 10.
        In the case of Running and Cycling, if 1 rep performs 100m, that is, 500m, using note(rep of unit), rep should be 5.

        example 1.
        {
          "Title": "Shoulder Exercises",
          "Monday": {
            "target": "Shoulder",
            "content": [
              {"exerciseId": 12, "exerciseName": "Front Dumbbell Raise", "sets": 5, "reps": 12, "weights": [3, 3, 3]},
              {"exerciseId": 11, "exerciseName": "Side Lateral Raise", "sets": 3, "reps": 8, "weights": [7, 7, 7]}
            ]
          }
        }

        example 2.
        {
          "Title": "Physical Fitness Exercises",
          "Monday": {
            "target": "Back",
            "content": [
              {"exerciseId": 20, "exerciseName": "Pull Up", "sets": 3, "reps": 5},
              {"exerciseId": 14, "exerciseName": "Seated Row", "sets": 5, "reps": 7, "weights": [30, 30, 30]},
              {"exerciseId": 5, "exerciseName": "Lat Pulldown", "sets": 5, "reps": 10, "weights": [40, 35, 30]}
            ]
          },
          "Tuesday": {
            "target": "Shoulder",
            "content": [
              {"exerciseId": 10, "exerciseName": "Shoulder Press", "sets": 3, "reps": 20, "weights": [15, 15, 10]},
              {"exerciseId": 12, "exerciseName": "Front Dumbbell Raise", "sets": 5, "reps": 10, "weights": [5, 5, 5]},
            ]
          },
          "Wednesday": {
            "target": "Chest and Arms",
            "content": [
              {"exerciseId": 3, "exerciseName": "Chest Press Machine", "sets": 3, "reps": 15, "weights": [20, 20, 20]},
              {"exerciseId": 19, "exerciseName": "Chest Dips", "sets": 3, "reps": 12},
              {"exerciseId": 21, "exerciseName": "Push Up", "sets": 5, "reps": 15}
            ]
          },
          "Thursday": {
            "target": "Cardio adn Core",
            "content": [
              {"exerciseId": 22, "exerciseName": "Front Plank", "sets": 2, "reps": 10},
              {"exerciseId": 23, "exerciseName": "Side Plank", "sets": 1, "reps": 10},
              {"exerciseId": 25, "exerciseName": "Cycling", "sets": 1, "reps": 70}
            ]
          },
          "Friday": {
            "target": "Chest and Arms",
            "content": [
              {"exerciseId": 21, "exerciseName": "Push Up", "sets": 4, "reps": 30},
              {"exerciseId": 9, "exerciseName": "Dumbbell Fly", "sets": 5, "reps": 8, "weights": [20, 20, 20]},
              {"exerciseId": 19, "exerciseName": "Chest Dips", "sets": 3, "reps": 12},
              {"exerciseId": 1, "exerciseName": "Bench Press", "sets": 4, "reps": 5, "weights": [40, 40, 40]}
            ]
          },
          "Saturday": {
            "target": "Lower Body",
            "content": [
              {"exerciseId": 15, "exerciseName": "Leg Curl", "sets": 5, "reps": 10, "weights": [20, 20, 20]},
              {"exerciseId": 19, "exerciseName": "Leg Press", "sets": 2, "reps": 8, "weights": [80, 70, 60]}
            ]
          },
          "Sunday": {
            "target": "Cardio adn Core",
            "content": [
              {"exerciseId": 22, "exerciseName": "Front Plank", "sets": 2, "reps": 10},
              {"exerciseId": 23, "exerciseName": "Side Plank", "sets": 1, "reps": 10},
              {"exerciseId": 24, "exerciseName": "Running", "sets": 3, "reps": 10}
            ]
          }
        }

        example 3.
        {
          "Title": "Full Body Workout",
          "Monday": {
            "target": "Arms",
            "content": [
              {"exerciseId": 2, "exerciseName": "Incline Dumbbell Press", "sets": 5, "reps": 8, "weights": [15, 10, 10]},
              {"exerciseId": 19, "exerciseName": "Chest Dips", "sets": 3, "reps": 12}
            ]
          },
          "Tuesday": {
            "target": "Back",
            "content": [
              {"exerciseId": 20, "exerciseName": "Pull Up", "sets": 4, "reps": 5},
              {"exerciseId": 5, "exerciseName": "Lat Pulldown", "sets": 3, "reps": 12, "weights": [50, 45, 40]},
              {"exerciseId": 8, "exerciseName": "Dumbbell Row", "sets": 3, "reps": 12, "weights": [10, 10, 10]},
              {"exerciseId": 6, "exerciseName": "Barbell Row", "sets": 2, "reps": 8, "weights": [20, 20, 20]},
            ]
          },
          "Wednesday": {
            "target": "Shoulder",
            "content": [
              {"exerciseId": 10, "exerciseName": "Shoulder Press", "sets": 3, "reps": 10, "weights": [20, 20, 20]},
              {"exerciseId": 11, "exerciseName": "Side Lateral Raise", "sets": 3, "reps": 12, "weights": [5, 5, 5]},
              {"exerciseId": 13, "exerciseName": "Bent Over Lateral Raise", "sets": 4, "reps": 12, "weights": [5, 5, 5]}
            ]
          },
          "Thursday": {
            "target": "Lower Body",
            "content": [
              {"exerciseId": 4, "exerciseName": "Leg Extension", "sets": 3, "reps": 10, "weights": [40, 40, 40]},
              {"exerciseId": 19, "exerciseName": "Leg Press", "sets": 2, "reps": 8, "weights": [80, 70, 60]}
            ]
          },
          "Friday": {
            "target": "Chest",
            "content": [
              {"exerciseId": 19, "exerciseName": "Chest Dips", "sets": 3, "reps": 12},
              {"exerciseId": 21, "exerciseName": "Push Up", "sets": 4, "reps": 30},
              {"exerciseId": 1, "exerciseName": "Bench Press", "sets": 4, "reps": 5, "weights": [40, 40, 40]}
            ]
          },
          "Saturday": {
            "target": "Cardio",
            "content": [
              {"exerciseId": 24, "exerciseName": "Running", "sets": 1, "reps": 30}
            ]
          },
          "Sunday": {
            "target": "Core",
            "content": [
              {"exerciseId": 22, "exerciseName": "Front Plank", "sets": 3, "reps": 10},
              {"exerciseId": 23, "exerciseName": "Side Plank", "sets": 3, "reps": 10},
              {"exerciseId": 21, "exerciseName": "Push Up", "sets": 5, "reps": 20}
            ]
          }
        }

        Examples are just examples, recommend various combinations regardless of the order.
        Never Explain.
        `;
        next();
    } catch (err) {
        res.send(errResponse(baseResponse.GPT_ERROR));
    }
};

module.exports = gptMiddleware;