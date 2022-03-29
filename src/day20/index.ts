import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const goA = (input) => {
  const minGifts = parseInt(input.trim()) / 10;

  let gifts = 0;
  let houseNumber = 0;

  while(gifts < minGifts){
    houseNumber++;
    gifts = 0;

    for(let i = 1; i <= Math.floor(Math.sqrt(houseNumber)); i++) {
      if(houseNumber % i === 0) {
        gifts += i;
        gifts += (houseNumber / i);
      }
    }
  }

  return houseNumber
}

const goB = (input) => {
  const minGifts = parseInt(input.trim());

  let gifts = 0;
  let houseNumber = 0;

  while(gifts < minGifts){
    houseNumber++;
    gifts = 0;

    for(let i = 1; i <= Math.floor(Math.sqrt(houseNumber)); i++) {
      if(houseNumber % i === 0) {
        const rest = houseNumber / i;
        if(rest <= 50) {
          gifts += i * 11;
        }
        if(i <= 50) {
          gifts += rest * 11;
        }
      }
    }
  }

  return houseNumber
}

/* Tests */

test(goA("70"), 4)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
