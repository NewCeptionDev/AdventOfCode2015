import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const calculateNextCode = (code: number) => {
  return (code * 252533) % 33554393
}

const codeForRowAndColumn = (row: number, column: number) => {
  const neededRow = row + column - 2;

  const calculatedUpToRow = ((neededRow * neededRow) + neededRow) / 2

  let code = 20151125;

  for(let i = 0; i < calculatedUpToRow + column - 1; i++) {
    code = calculateNextCode(code);
  }

  return code
}

const goA = (input) => {
  const lines = splitToLines(input);
  const row = parseInt(lines[0].split(": ")[1].trim())
  const column = parseInt(lines[1].split(": ")[1].trim())

  return codeForRowAndColumn(row, column)
}

const goB = (input) => {
  return
}

/* Tests */

test(calculateNextCode(20151125), 31916031)
test(calculateNextCode(31916031), 18749137)
test(codeForRowAndColumn(4, 2), 32451966)
test(codeForRowAndColumn(2, 2), 21629792)
test(codeForRowAndColumn(1, 2), 18749137)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
