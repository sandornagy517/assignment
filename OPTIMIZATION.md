# Unit tests, benchmarks and test data

As inputs I’ve generated `100 000` random strings to use it as test data. Every implementation will be run against the same data which will be randomised each time benchmarks are run.

# 1st iteration: ~ 4.85 ms

I’ve added some unit tests and then I’ve implemented the simplest most straightforward solution using built in JS functions like `split` and `filter` knowing that these will be the bottlenecks. First I just wanted to make sure I had a working solution.

```
export function court1(name, judges, others) {
	if (!others) {
    return 30;
  }

  const pos = others.split(' ').filter(otherName => otherName < name).length;
  return Math.floor(pos / judges) * 30 + 30;
}
```

# 2nd iteration: ~ 3.98 ms

I focused on eliminating `split()` first. I know that regular expressions can be slow but I thought I’d give it a try and see with benchmarks how it’s behaving with various sizes of data.

```jsx
export function court2(name, judges, others) {
  if (!others) {
    return 30;
  }

  const exp = /[^ ]+/g;

  let pos = 0;
  let match;

  while ((match = exp.exec(others)) !== null) {
    if (match[0] < name) {
      pos++;
    }
  }

  return Math.floor(pos / judges) * 30 + 30;
}
```

# 3rd iteration: ~ 2.99 ms

I knew that probably I’ll be able to iterate over the string skipping a bunch of characters but first I just wanted to make sure I have a basic way to iterate over the string manually. I was also not too worried about comparing strings, just wanted to have a solution for this which passes the tests.

```
export function court3(name, judges, others) {
	if (!others) {
    return 30;
  }

  let pos = 0;
  let start = 0;
  let space = -1;

  while ((space = others.indexOf(' ', start)) !== -1) {
    if (others.substring(start, space) < name) {
      pos++;
    }
    start = space + 1;
  }

  if (start < others.length) {
    if (others.substring(start) < name) {
      pos++;
    }
  }

  return Math.floor(pos / judges) * 30 + 30;
}
```

# 4th iteration: ~ 1.74 ms

What I wanted to do next was to loop through only specific parts of the string and when we find a preceding name skip to the next name utilising `indexOf` which I was worried about using thinking it might slow it down but my custom solution for getting indexes was way slower. I did not include the code but I’ve tried this with comparing strings too, it was slower so I kept going with `charcodeAt` comparisons.

```
export function court4(name, judges, others) {
  if (!others) {
    return 30;
  }
  let pos = 0;
  let start = 0;
  const nameLen = name.length;
  const othersLen = others.length;

  outer_while: while (start < othersLen) {
    let end = others.indexOf(' ', start);
    if (end === -1) {
      end = othersLen;
    }
    const currentNameLen = end - start;
    const minLen = nameLen < currentNameLen ? nameLen : currentNameLen;
    for (let j = 0; j < minLen; j++) {
      const otherCharCode = others.charCodeAt(start + j);
      const nameCharCode = name.charCodeAt(j);
      if (otherCharCode !== nameCharCode) {
        if (otherCharCode < nameCharCode) {
          pos++;
        }
        start = end + 1;
        continue outer_while;
      }
    }
    if (currentNameLen < nameLen) {
      pos++;
    }
    start = end + 1;
  }
  return Math.floor(pos / judges) * 30 + 30;
}
```

# 5th iteration: ~ 1.5 ms

Since most of the names will already differ in the first character I’m comparing them by the first character only, in very rare cases will the first 4 characters match so I’m comparing the first 3 and if those still match I’ll start looping through the name. This speeds up the 4th iteration also by storing the `charCode` of the `name` string so we don’t have to run those computations on each run of the while loop like in step 4.

```
export function court5(name, judges, others) {
	if (!others) {
    return 30;
  }
  let pos = 0;
  let start = 0;
  const nameLen = name.length;
  const othersLen = others.length;
  const nameFirstChar = name.charCodeAt(0);
  const nameSecondChar = nameLen > 1 ? name.charCodeAt(1) : 0;
  const nameThirdCar = nameLen > 2 ? name.charCodeAt(2) : 0;
  outer_while: while (start < othersLen) {
    let end = others.indexOf(' ', start);
    if (end === -1) {
      end = othersLen;
    }

    const otherFirstChar = others.charCodeAt(start);
    if (otherFirstChar < nameFirstChar) {
      pos++;
      start = end + 1;
      continue;
    }
    if (otherFirstChar > nameFirstChar) {
      start = end + 1;
      continue;
    }

    const currentNameLen = end - start;
    if (nameLen > 1 && currentNameLen > 1) {
      const otherSecondChar = others.charCodeAt(start + 1);
      if (otherSecondChar < nameSecondChar) {
        pos++;
        start = end + 1;
        continue;
      }
      if (otherSecondChar > nameSecondChar) {
        start = end + 1;
        continue;
      }
      if (nameLen > 2 && currentNameLen > 2) {
        const otherThirdChar = others.charCodeAt(start + 2);
        if (otherThirdChar < nameThirdCar) {
          pos++;
          start = end + 1;
          continue;
        }
        if (otherThirdChar > nameThirdCar) {
          start = end + 1;
          continue;
        }
        if (nameLen > 3 && currentNameLen > 3) {
          const minLen = nameLen < currentNameLen ? nameLen : currentNameLen;
          for (let j = 3; j < minLen; j++) {
            const otherCharCode = others.charCodeAt(start + j);
            const nameCharCode = name.charCodeAt(j);
            if (otherCharCode !== nameCharCode) {
              if (otherCharCode < nameCharCode) {
                pos++;
              }
              start = end + 1;
              continue outer_while;
            }
          }
        }
      }
    }
    if (currentNameLen < nameLen) {
      pos++;
    }
    start = end + 1;
  }
  return Math.floor(pos / judges) * 30 + 30;
```
