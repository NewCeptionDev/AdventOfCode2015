import { test, readInput } from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const incrementPassword = (password: string): string => {
  let currentPassword = password;
  let newPassword = "";

  const lastCharCode = "z".charCodeAt(0);

  let wrapAroundOrStart = true;
  for(let i = currentPassword.length - 1; i >= 0 && wrapAroundOrStart; i--) {
    newPassword = currentPassword.substr(0, i);

    const indexCharCode = currentPassword.charCodeAt(i);

    if(indexCharCode === lastCharCode) {
      newPassword += "a";
      wrapAroundOrStart = true
    } else {
      newPassword += String.fromCharCode(currentPassword.charCodeAt(i) + 1);
      wrapAroundOrStart = false;
    }

    if(currentPassword.length > i + 1) {
      newPassword += currentPassword.substr(i+1, currentPassword.length - 1);
    }
    currentPassword = newPassword;
  }

  return newPassword;
}

const passwordIncludesIncreasingStraight = (password: string, straightLength: number): boolean => {
  let lastCharCode = -1;
  let currentStraightLength = 1;
  for(let i = 0; i < password.length; i++) {
    if(lastCharCode >= 0 && lastCharCode + 1 === password.charCodeAt(i)) {
      currentStraightLength++;
    } else {
      currentStraightLength = 1;
    }

    if(currentStraightLength >= straightLength) {
      return true;
    }

    lastCharCode = password.charCodeAt(i);
  }

  return false;
}

const passwordContainsBadCharacters = (password: string): boolean => {
  return password.includes("o") || password.includes("i") || password.includes("l");
}

const getCountOfUniquePairsInPassword = (password: string): number => {
  let count = 0;

  let lastCharacter = ""
  let lettersInPairs = [];

  for(let i = 0; i < password.length; i++) {

    if(lastCharacter === password.charAt(i) && !lettersInPairs.includes(lastCharacter)) {
      count++;
      lettersInPairs.push(lastCharacter)
    }

    lastCharacter = password.charAt(i);
  }

  return count;
}

const passwordContainsUniquePairsOfCharacters = (password: string, pairCount: number) => {
  return getCountOfUniquePairsInPassword(password) >= pairCount;
}

const goA = (input) => {
  let password = input.trim();

  password = incrementPassword(password);
  while(!passwordIncludesIncreasingStraight(password, 3) || passwordContainsBadCharacters(password) || !passwordContainsUniquePairsOfCharacters(password, 2)) {
    password = incrementPassword(password);
  }

  return password;
}

const goB = (input) => {
  return goA(goA(input));
}

/* Tests */

test(incrementPassword("xx"), "xy")
test(incrementPassword("xz"), "ya")
test(passwordIncludesIncreasingStraight("abc", 3), true)
test(passwordIncludesIncreasingStraight("abd", 3), false)
test(passwordIncludesIncreasingStraight("cqjxxyyz", 3), false)
test(passwordContainsBadCharacters("ihg"), true)
test(passwordContainsBadCharacters("hog"), true)
test(passwordContainsBadCharacters("hblg"), true)
test(passwordContainsBadCharacters("hbsg"), false)
test(getCountOfUniquePairsInPassword("aa"), 1)
test(getCountOfUniquePairsInPassword("aaa"), 1)
test(getCountOfUniquePairsInPassword("aaaa"), 1)
test(getCountOfUniquePairsInPassword("aazz"), 2)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
