const deepl = require('deepl-node');
const secret = require('./config/secret');

const responseContent = 
[
  {
    "Title": "Beginner Full Body Workout",
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
;

// const translator = new deepl.Translator(secret.deepLKey);

// async function temp() {
//   for (let i=0; i<responseContent.length; i++) {
//     const keys = Object.keys(responseContent[i]);
//     const values = [];
//     keys.forEach(key => {
//       if (key==='Title') values.push(responseContent[i]['Title']);
//       else values.push(responseContent[i][key].target);
//     });

//     const translateTexts = await translator.translateText(values.join(','), 'en', 'ko');
//     const translateValues = translateTexts.text.split(',').map(item => item.trim());

//     for (let j=0; j<keys.length; j++) {
//       if (keys[j]==='Title') responseContent[i]['Title'] = translateValues[j];
//       else if (translateValues[j]==='유산소 운동') responseContent[i][keys[j]].target = '유산소';
//       else responseContent[i][keys[j]].target = translateValues[j];
//     };
//   };

//   console.log(responseContent);
// }

// temp();

for(let i=2; i<responseContent.length; i++) {
  const values = Object.values(responseContent[i]);
  for(let j=0; j<values.length; j++) {
    if (values[j].content) {
      values[j] = values[j].content;
    }
  }
  console.log(values)
  console.log(" ");
  break;
}