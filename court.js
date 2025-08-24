export function court1(name, judges, others) {
  if (!others) {
    return 30;
  }
  const pos = others.split(' ').filter(otherName => otherName < name).length;
  return Math.floor(pos / judges) * 30 + 30;
}

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

export function court3(name, judges, others) {
  if (!others) {
    return 30;
  }
  let pos = 0;
  let start = 0;
  let end = others.length;
  while ((end = others.indexOf(' ', start)) !== -1) {
    if (others.substring(start, end) < name) {
      pos++;
    }
    start = end + 1;
  }
  if (start < others.length) {
    if (others.substring(start) < name) {
      pos++;
    }
  }
  return Math.floor(pos / judges) * 30 + 30;
}

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
}
