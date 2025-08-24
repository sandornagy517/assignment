import * as functionsToTest from './court.js';
import { getRandomString, getRandomArray } from './mock_generator.js';

describe('iterations', () => {
  const functions = [];

  for (const name in functionsToTest) {
    functions.push({
      name,
      fn: functionsToTest[name]
    });
  }

  const randomName = getRandomString();
  const randomNames = getRandomArray(15000).join(' ');
  const randomJudges = Math.floor(Math.random() * 15000) + 1;

  const testCases = [{
    description: 'name is in the middle of the queue',
    name: 'Bob',
    judges: 2,
    others: 'Alice Ben Charlie David ',
    expectedWaitTime: 60,
  },
  {
    description: 'name is the first in the queue',
    name: 'Xavier',
    judges: 10,
    others: 'Yara Zoe',
    expectedWaitTime: 30,
  },
  {
    description: 'name is the last in the queue',
    name: 'David',
    judges: 2,
    others: 'Alice Bob Charlie',
    expectedWaitTime: 60,
  },
  {
    description: 'long queue with multiple judges',
    name: 'Lina',
    judges: 3,
    others: 'Ken John Eva Maria',
    expectedWaitTime: 60,
  },
  {
    description: 'more judges than people',
    name: 'Alice',
    judges: 5,
    others: 'Bob Charlie',
    expectedWaitTime: 30,
  },
  {
    description: 'very long queue',
    name: 'Z',
    judges: 5,
    others: Array.from({
      length: 99
    }, () => 'A').join(' '),
    expectedWaitTime: 600,
  },
  {
    description: 'name is the last in the queue with one judge',
    name: 'Zane',
    judges: 1,
    others: 'Mark Hank Ana Vivian',
    expectedWaitTime: 150,
  },
  {
    description: 'same initial letters different lengths',
    name: 'Ana',
    judges: 2,
    others: 'Ann Andrew Alice A',
    expectedWaitTime: 60,
  },
  {
    description: 'names that differ only in the last character',
    name: 'Same',
    judges: 1,
    others: 'Sama Samb Samc Samd',
    expectedWaitTime: 150,
  },
  {
    description: 'exact same name as someone in the queue',
    name: 'Sam',
    judges: 3,
    others: 'Rob Sam Tom Vic',
    expectedWaitTime: 30,
  },
  {
    description: 'large number of people',
    name: 'Zack',
    judges: 100,
    others: Array.from({
      length: 999
    }, () => 'Aaron').join(' '),
    expectedWaitTime: 300,
  },
  {
    description: 'large number of judges',
    name: 'Middle',
    judges: 1,
    others: Array.from({
      length: 999
    }, (_, i) => i < 500 ? 'Aaron' : 'Zack').join(' '),
    expectedWaitTime: 15030,
  },
  {
    description: 'queue with identical names',
    name: 'John',
    judges: 2,
    others: 'John John John John',
    expectedWaitTime: 30,
  },
  {
    description: '15,000 random names',
    name: randomName,
    judges: randomJudges,
    others: randomNames,
    expectedWaitTime: functionsToTest.court1(randomName, randomJudges, randomNames),
  },
  {
    description: 'high number of identical characters in names',
    name: 'AAAAAAAAAAAAAAAG',
    judges: 1,
    others: 'AAAAAAAAAAAAAAAB AAAAAAAAAAAAAAAC AAAAAAAAAAAAAAAD AAAAAAAAAAAAAAAE AAAAAAAAAAAAAAAF',
    expectedWaitTime: 180,
  },
  ];

  functions.forEach(({
    name: fnName,
    fn
  }) => {
    describe(fnName, () => {
      testCases.forEach((testCase) => {
        test(testCase.description, () => {
          const {
            name,
            judges,
            others,
            expectedWaitTime
          } = testCase;
          const result = fn(name, judges, others);
          expect(result).toBe(expectedWaitTime);
        });
      });
    });
  });
});