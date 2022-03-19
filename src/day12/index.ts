import { test, readInput } from "../utils/index"
import {inspect} from "util";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const getSumOfNumbers = (json: Object): number => {
  let sum = 0;

  let values = Object.values(json);

  for(let value of values) {
    if(typeof value === "object") {
      sum += getSumOfNumbers(value);
    } else if(typeof value === "number") {
      sum += value;
    }
  }

  return sum;
}

const getSumOfNumbersWithOutRed = (json: Object): number => {
  let sum = 0;

  let values = Object.values(json);

  let hasRedInIt = false;

  for(let value of values) {
    if(typeof value === "object") {
      if(value instanceof Array || !Object.values(value).includes("red")) {
        sum += getSumOfNumbersWithOutRed(value);
      }
    } else if(typeof value === "number") {
      sum += value;
    }
  }

  return hasRedInIt ? 0 : sum;
}

const goA = (input) => {
  const parsedJson = JSON.parse(input.trim());

  return getSumOfNumbers(parsedJson)
}

const goB = (input) => {
  const parsedJson = JSON.parse(input.trim());

  return getSumOfNumbersWithOutRed(parsedJson)
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
