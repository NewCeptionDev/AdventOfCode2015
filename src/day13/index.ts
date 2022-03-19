import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface HappinessChange {
  person: string;
  change: number;
  neighbour: string;
}

const parseHappinessChanges = (lines: string[]): HappinessChange[] => {
  let changes: HappinessChange[] = [];

  for(let line of lines) {
    const split = line.split(" ");

    const changeNumber = parseInt(split[3]);
    changes.push({
      person: split[0],
      change: split[2] === "gain" ? changeNumber : -1 * changeNumber,
      neighbour: split[10].substr(0, split[10].length - 1)
    })
  }

  return changes
}

// Taken from https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979
const permute = (permutation: string[]): string[][] => {
  let length = permutation.length;
  let result = [permutation.slice()];
  let c = new Array(length).fill(0);
  let i = 1, k, p;

  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i];
      p = permutation[i];
      permutation[i] = permutation[k];
      permutation[k] = p;
      ++c[i];
      i = 1;
      result.push(permutation.slice());
    } else {
      c[i] = 0;
      ++i;
    }
  }
  return result;
}

const calculateHappinessChangeForSeating = (seating: string[], happinessChanges: HappinessChange[]): number => {
  let change = 0;

  for(let i = 0; i < seating.length; i++) {
    let prevIndex = i - 1;
    let nextIndex = i + 1;

    if(i === 0) {
      prevIndex = seating.length - 1;
    }

    if(i === seating.length - 1) {
      nextIndex = 0;
    }

    change += happinessChanges.find(happiness => happiness.person === seating[i] && happiness.neighbour === seating[prevIndex]).change;
    change += happinessChanges.find(happiness => happiness.person === seating[i] && happiness.neighbour === seating[nextIndex]).change;
  }

  return change;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const happinessChanges = parseHappinessChanges(lines);

  const distinctPersons = [];

  for(let change of happinessChanges) {
    if(!distinctPersons.includes(change.person)) {
      distinctPersons.push(change.person)
    }
  }

  const allPermutations = permute(distinctPersons);

  return allPermutations.map(perm => calculateHappinessChangeForSeating(perm, happinessChanges)).sort((a, b) => a - b).pop();
}

const goB = (input) => {
  const lines = splitToLines(input);
  const happinessChanges = parseHappinessChanges(lines);

  const distinctPersons = [];

  for(let change of happinessChanges) {
    if(!distinctPersons.includes(change.person)) {
      distinctPersons.push(change.person)
    }
  }

  for(let person of distinctPersons) {
    happinessChanges.push({
      person: person,
      change: 0,
      neighbour: "You"
    })
    happinessChanges.push({
      person: "You",
      change: 0,
      neighbour: person
    })
  }

  distinctPersons.push("You")

  const allPermutations = permute(distinctPersons);

  return allPermutations.map(perm => calculateHappinessChangeForSeating(perm, happinessChanges)).sort((a, b) => a - b).pop();
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
