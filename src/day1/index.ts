import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  let floor: number = 0;

  for(let movement of input){
    if(movement === '('){
      floor++;
    } else if(movement === ')'){
      floor--;
    }
  }

  return floor;
}

const goB = (input) => {
  let floor: number = 0;
  let index: number = 0;

  for(let movement of input){
    index++;

    if(movement === '('){
      floor++;
    } else if(movement === ')'){
      floor--;
    }

    if(floor === -1){
      return index
    }
  }
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
