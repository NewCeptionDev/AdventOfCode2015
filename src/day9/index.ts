import { test, readInput } from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Route {
  start: string;
  end: string;
  distance: number;
}

const parseRoute = (line: string): Route => {
  const routeAndDistance = line.split("=");

  const startAndEnd = routeAndDistance[0].split("to");

  return {
    start: startAndEnd[0].trim(),
    end: startAndEnd[1].trim(),
    distance: parseInt(routeAndDistance[1].trim())
  }
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

const calculateFullRouteDistance = (route: string[], routes: Route[], minRoute: boolean): number => {
  let distance: number = 0;

  for(let i = 1; i < route.length; i++) {
    const routeElem = routes.find(startToEnd => (startToEnd.start === route[i - 1] && startToEnd.end === route[i]) || (startToEnd.end === route[i - 1] && startToEnd.start === route[i]))

    if(!routeElem) {
      return minRoute ? Number.MAX_SAFE_INTEGER : Number.MIN_SAFE_INTEGER;
    }

    distance += routeElem.distance;
  }

  return distance;
}

const goA = (input) => {
  const lines: string[] = splitToLines(input);

  const routes: Route[] = lines.map(line => parseRoute(line));

  const distinctLocations: string[] = [];

  for(let route of routes) {
    if(!distinctLocations.includes(route.start)) {
      distinctLocations.push(route.start);
    }

    if(!distinctLocations.includes(route.end)) {
      distinctLocations.push(route.end);
    }
  }

  const allPossibleRoutes: string[][] = permute(distinctLocations);

  return allPossibleRoutes.map(route => calculateFullRouteDistance(route, routes, true)).sort((a, b) => a - b)[0];
}

const goB = (input) => {
  const lines: string[] = splitToLines(input);

  const routes: Route[] = lines.map(line => parseRoute(line));

  const distinctLocations: string[] = [];

  for(let route of routes) {
    if(!distinctLocations.includes(route.start)) {
      distinctLocations.push(route.start);
    }

    if(!distinctLocations.includes(route.end)) {
      distinctLocations.push(route.end);
    }
  }

  const allPossibleRoutes: string[][] = permute(distinctLocations);

  return allPossibleRoutes.map(route => calculateFullRouteDistance(route, routes, false)).sort((a, b) => a - b).pop();
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt")), 605)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
