// const deepl = require('deepl-node');
// const secret = require('./config/secret');

// const translator = new deepl.Translator(secret.deepLKey);

// async function translateText() {
//   translator
//     .translateText(['full body strength training,shoulder,cardio,back,back'], 'en', 'ko')
//     .then((result) => { console.log(result); })
//     .catch((error) => { console.error(error); })
// }

// translateText();

const responseContent = 
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
;

const responseContentKeys = [];
const responseContentValues = [];
responseContent.forEach(element => {
  const keys = Object.keys(element)
  responseContentKeys.push(keys);
  keys.forEach(key => {
    if (key==='Title') {
      responseContentValues.push(element[key]);
    } else {
      responseContentValues.push(element[key].target);
    }
  })
})

console.log(responseContentValues);