import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const containsAtLeastThreeVowels = (toCheck: string) => {
  const vowels = ['a', 'e', 'i', 'o', 'u']
  let vowelCount = 0;

  for(let i = 0; i < toCheck.length; i++){
    if(vowels.includes(toCheck.charAt(i).toLowerCase())){
      vowelCount++;
    }
  }

  return vowelCount >= 3;
}

const twoSameLettersInARow = (toCheck : string) => {
  let lastChar = "";
  let twoSameLettersInARow = false;

  for(let i = 0; i < toCheck.length; i++){
    if(lastChar != "" && toCheck.charAt(i) === lastChar){
      twoSameLettersInARow = true
    } else {
      lastChar = toCheck.charAt(i);
    }
  }

  return twoSameLettersInARow;
}

const noIllegalParts = (toCheck: string) => {
  const illegal = ["ab", "cd", "pq", "xy"]

  let legal = true;

  for(let i = 1; i < toCheck.length && legal; i++){
    if(illegal.includes(toCheck.substring(i-1, i+1))){
      legal = false;
    }
  }

  return legal;
}

const isStringNice = (toCheck: string): boolean => {
    return containsAtLeastThreeVowels(toCheck) && twoSameLettersInARow(toCheck) && noIllegalParts(toCheck)
}

const goA = (input) => {
  const strings = input.split("\n");

  let niceStrings = 0;

  for(let string of strings){
    if(string != "" && isStringNice(string)){
      niceStrings++;
    }
  }

  return niceStrings
}

const samePairNoOverlap = (toCheck: string): boolean => {
  let samePairNoOverlap = false;
  let pairs = {}

  for(let i = 1; i < toCheck.length && !samePairNoOverlap; i++){
    pairs[i-1] = toCheck.charAt(i-1) + toCheck.charAt(i);
  }

  let keys = Object.keys(pairs)

  for(let i = 0; i < keys.length && !samePairNoOverlap; i++) {
    for(let j = 0; j < keys.length && !samePairNoOverlap; j++) {
      if(i !== j && (i + 1) !== j && i < j && pairs[i] === pairs[j]){
        samePairNoOverlap = true;
      }
    }
  }

  return samePairNoOverlap
}

const sameLetterWithOneSpacer = (toCheck: string) => {
  let sameLetterWithOneSpacer = false;

  for(let i = 0; i < toCheck.length && !sameLetterWithOneSpacer; i++){
    if(toCheck.length > (i + 2) && toCheck.charAt(i) === toCheck.charAt(i+2)){
      sameLetterWithOneSpacer = true;
    }
  }

  return sameLetterWithOneSpacer
}

const isStringNice2 = (toCheck: string): boolean => {
  return sameLetterWithOneSpacer(toCheck) && samePairNoOverlap(toCheck)
}

const goB = (input) => {
  const strings = input.split("\n");

  let niceStrings = 0;

  for(let string of strings){
    if(string != "" && isStringNice2(string)){
      niceStrings++;
    }
  }

  return niceStrings
}

/* Tests */

test(isStringNice("ugknbfddgicrmopn"), true)
test(isStringNice("aaa"), true)
test(isStringNice("jchzalrnumimnmhp"), false)
test(isStringNice("haegwjzuvuyypxyu"), false)
test(isStringNice("dvszwmarrgswjxmb"), false)
test(isStringNice2("qjhvhtzxzqqjkmpb"), true)
test(isStringNice2("xxyxx"), true)
test(isStringNice2("uurcxstgmygtbstg"), false)
test(isStringNice2("ieodomkazucvgmuy"), false)
test(isStringNice2("aaa"), false)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
