import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  let requiredSquareFeet = 0
  let lines = input.split("\n")

  lines.forEach(line => {
    if (line !== "") {

      let lengths = line.split("x")
      let lengthsAsNumbers = lengths.map(numberString => parseInt(numberString))

      let sides = [lengthsAsNumbers[0] * lengthsAsNumbers[1], lengthsAsNumbers[1] * lengthsAsNumbers[2], lengthsAsNumbers[0] * lengthsAsNumbers[2]].sort((a, b) => {
        return a - b
      })

      let surfaceArea = sides[0] * 2 + sides[1] * 2 + sides[2] * 2

      requiredSquareFeet += surfaceArea + sides[0]
    }
  })

  return requiredSquareFeet
}

const goB = (input) => {
  let requiredRibbon = 0
  let lines = input.split("\n")

  lines.forEach(line => {
    if (line !== "") {

      let lengths = line.split("x")
      let lengthsAsNumbers = lengths.map(numberString => parseInt(numberString)).sort((a, b) => {
        return a - b
      })

      requiredRibbon += lengthsAsNumbers[0] * 2 + lengthsAsNumbers[1] * 2 + lengthsAsNumbers.reduce((a, b) => a * b, 1)
    }
  })

  return requiredRibbon
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
