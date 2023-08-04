const t = '[\n' +
    '    {\n' +
    `        'Title': "등 운동",\n` +
    "        'Monday': {\n" +
    "            'target': '등',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 40, 50]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Wednesday': {\n" +
    "            'target': '등',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [35, 40, 45]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [35, 45, 50]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Friday': {\n" +
    "            'target': '등',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [40, 45, 50]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [40, 50, 55]\n" +
    '                }\n' +
    '            ]\n' +
    '        }\n' +
    '    },\n' +
    '    {\n' +
    `        'Title': "하체 운동",\n` +
    "        'Monday': {\n" +
    "            'target': '하체',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [60, 80, 100]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Wednesday': {\n" +
    "            'target': '하체',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [80, 100, 120]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Friday': {\n" +
    "            'target': '하체',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [100, 120, 140]\n" +
    '                }\n' +
    '            ]\n' +
    '        }\n' +
    '    },\n' +
    '    {\n' +
    `        'Title': "전신 운동",\n` +
    "        'Monday': {\n" +
    "            'target': '전신',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 40, 50]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [20, 25, 30]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [60, 80, 100]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Wednesday': {\n" +
    "            'target': '전신',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [35, 40, 45]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [35, 45, 50]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [25, 30, 35]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [80, 100, 120]\n" +
    '                }\n' +
    '            ]\n' +
    '        },\n' +
    "        'Friday': {\n" +
    "            'target': '전신',\n" +
    "            'content': [\n" +
    '                {\n' +
    "                    'exerciseId': 13,\n" +
    "                    'exerciseName': 'Seated Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 5,\n" +
    "                    'exerciseName': 'Lat Pull down',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [40, 45, 50]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 6,\n" +
    "                    'exerciseName': 'Barbell Row',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [40, 50, 55]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 4,\n" +
    "                    'exerciseName': 'Leg Extension',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 12,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 14,\n" +
    "                    'exerciseName': 'Leg Curl',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [30, 35, 40]\n" +
    '                },\n' +
    '                {\n' +
    "                    'exerciseId': 15,\n" +
    "                    'exerciseName': 'Leg Press',\n" +
    "                    'sets': 3,\n" +
    "                    'reps': 10,\n" +
    "                    'weights': [100, 120, 140]\n" +
    '                }\n' +
    '            ]\n' +
    '        }\n' +
    '    }\n' +
    ']';

    const te = [
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

console.log(JSON.stringify(te));
console.log(JSON.parse(JSON.stringify(te)));