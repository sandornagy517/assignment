import chalk from 'chalk';
import * as functions from './court.js';
import { performance } from 'perf_hooks';
import { getRandomArray, getRandomString, randomNames } from './mock_generator.js';

function generateRandomData() {
  return {
    name: getRandomString(),
    judges: 2,
    others: getRandomArray(100000).join(' '),
    iterations: 1000
  };
}

function generateData() {
  return {
    name: randomNames[900],
    judges: 2,
    others: randomNames.join(' '),
    iterations: 1000
  };
}

const smallData = {
  name: "Jules",
  judges: 3,
  others: "Adam Betty Frank Mike Jhon Andrew Timothy",
  iterations: 1000
};

function runBenchmark(func, iterations, ...args) {
  let time = 0;
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    func(...args);
    const end = performance.now();
    time += (end - start);
  }
  return time / iterations;
}

function runTests(datasetName, data) {
  const results = [];

  // To be honest, I don't know too much about JIT compilations, I've ran into a problem that I got different benchmark results for the same code.
  // I've included this to "warm up" to allow for JIT compliation.
  for (const name in functions) {
    for (let i = 0; i < 1000; i++) {
      functions[name](data.name, data.judges, data.others);
    }
  }

  for (const name in functions) {
    const time = runBenchmark(functions[name], data.iterations, data.name, data.judges, data.others);
    results.push({
      name,
      time
    });
  }

  results.sort((a, b) => a.time - b.time);

  console.log(chalk.blue.underline.bold(`\n${datasetName} - ${data.others.split(' ').length} names | Results ranked by speed:`));
  results.forEach((result, index) => {
    if (index === 0) {
      return console.log(chalk.bgGreen(` ${index + 1}. ${result.name}: ${result.time.toFixed(10)} ms `));
    }
    return console.log(chalk(` ${index + 1}. ${result.name}: ${result.time.toFixed(10)} ms `));
  });
}

runTests("Small dataset", smallData);
console.log('\n');
runTests("Actual names", generateData());

console.log('\n Benchmark running for big dataset. It might take a couple of seconds / minutes for the results to appear... \n');
runTests("Big dataset", generateRandomData());