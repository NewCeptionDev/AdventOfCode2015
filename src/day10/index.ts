import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const nextLookAndSaySequenceValue = (input: string): string => {
  let nextValue = "";

  let currentNumber = "";
  let currentNumberCount = 0;
  for(let char of input) {
    if(currentNumber === "") {
      currentNumber = char;
    }

    if(currentNumber === char) {
      currentNumberCount++;
    } else {
      nextValue += currentNumberCount + currentNumber;
      currentNumber = char;
      currentNumberCount = 1;
    }
  }
  nextValue += currentNumberCount.valueOf() + currentNumber.valueOf();

  return nextValue;
}

const goA = (input, amountOfRounds) => {
  let value = input.trim();

  for(let i = 0; i < amountOfRounds; i++) {
    value = nextLookAndSaySequenceValue(value);
  }

  return value.length
}

const goB = (input, amountOfRounds) => {
  let value = input.trim();

  for(let i = 0; i < amountOfRounds; i++) {
    value = nextLookAndSaySequenceValue(value);
  }

  return value.length
}

/* Tests */

test(goA("1", 1), 2)
test(goA("11", 1), 2)
test(goA("21", 1), 4)
test(goA("1211", 1), 6)
test(goA("111221", 1), 6)
test(goA("1", 5), 6)

/* Results */

console.time("Time")
const resultA = goA(input, 40)
const resultB = goB(input, 50)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
