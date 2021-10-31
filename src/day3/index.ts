import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  let x = 0
  let y = 0

  let visitedPositions = { 0: [0] }

  for (let char of input) {

    if (char === "<") {
      x--
    } else if (char === ">") {
      x++
    } else if (char === "^") {
      y--
    } else if (char === "v") {
      y++
    }

    if (visitedPositions[x]) {
      let xArr = visitedPositions[x]

      if (!xArr.includes(y)) {
        xArr.push(y)
        visitedPositions[x] = xArr
      }
    } else {
      visitedPositions[x] = [y]
    }
  }

  let sum = 0

  for (let x of Object.keys(visitedPositions)) {
    sum += visitedPositions[x].length
  }

  return sum
}

const goB = (input) => {
  let santaX = 0
  let santaY = 0

  let robotX = 0
  let robotY = 0

  let santaTurn = true

  let visitedPositions = { 0: [0] }

  for (let char of input) {

    if (santaTurn) {
      if (char === "<") {
        santaX--
      } else if (char === ">") {
        santaX++
      } else if (char === "^") {
        santaY--
      } else if (char === "v") {
        santaY++
      }
    } else {
      if (char === "<") {
        robotX--
      } else if (char === ">") {
        robotX++
      } else if (char === "^") {
        robotY--
      } else if (char === "v") {
        robotY++
      }
    }

    let x = 0;
    let y = 0;

    if(santaTurn){
      x = santaX;
      y = santaY;
    } else {
      x = robotX;
      y = robotY;
    }

    if (visitedPositions[x]) {
      let xArr = visitedPositions[x]

      if (!xArr.includes(y)) {
        xArr.push(y)
        visitedPositions[x] = xArr
      }
    } else {
      visitedPositions[x] = [y]
    }

    santaTurn = !santaTurn;
  }

  let sum = 0

  for (let x of Object.keys(visitedPositions)) {
    sum += visitedPositions[x].length
  }

  return sum
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
