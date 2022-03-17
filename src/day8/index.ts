import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getNumberOfCharacters = (input: string): number => {
  return input.length;
}

const getNumberOfValues = (input: string): number => {
  let numberOfValues = 0;

  let nextBackslash: boolean = false;
  for(let i = 0; i < input.length; i++) {
    if(!nextBackslash && input[i] !== '\\') {
      numberOfValues++;
    } else if(!nextBackslash && input[i] === '\\') {
      nextBackslash = true;
    } else {
      if(input[i] !== 'x') {
        numberOfValues++;
        nextBackslash = false;
      } else {
        i += 2;
        numberOfValues++;
        nextBackslash = false;
      }
    }
  }

  return numberOfValues - 2;
}

const getNumberOfCharacterToEncode = (input: string): number => {
  let neededCharacters = 0;

  for(let i = 0; i < input.length; i++) {
    if(input[i] === '\\' || input[i] === "\"") {
      neededCharacters++;
    }
  }

  return neededCharacters + 2;
}

const goA = (input) => {
  const lines: string[] = splitToLines(input);

  return lines.map(line => {
    return getNumberOfCharacters(line) - getNumberOfValues(line)
  }).reduce((previousValue, currentValue) => previousValue + currentValue);
}

const goB = (input) => {
  const lines: string[] = splitToLines(input);

  return lines.map(line => getNumberOfCharacterToEncode(line)).reduce((previousValue, currentValue) => previousValue + currentValue);
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
