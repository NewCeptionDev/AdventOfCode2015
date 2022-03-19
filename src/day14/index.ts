import { test, readInput } from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Reindeer {
  name: string,
  speed: number,
  runTime: number,
  restTime: number
}

const parseReindeer = (line: string): Reindeer => {
  const split = line.split(" ")

  return {
    name: split[0],
    speed: parseInt(split[3]),
    runTime: parseInt(split[6]),
    restTime: parseInt(split[13])
  }
}

const calculateRunDistanceAfterTime = (reindeer: Reindeer, time: number) => {
  const timeForCycle = reindeer.runTime + reindeer.restTime;
  const cycles = Math.floor(time / timeForCycle);
  const restTime = time - (cycles * timeForCycle);

  const distanceFullCycles = cycles * (reindeer.speed * reindeer.runTime);
  let distanceRest;
  if(restTime > reindeer.runTime) {
    distanceRest = reindeer.speed * reindeer.runTime;
  } else {
    distanceRest = reindeer.speed * restTime;
  }

  return distanceFullCycles + distanceRest;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const reindeerList = lines.map(line => parseReindeer(line));

  return reindeerList.map(reindeer => calculateRunDistanceAfterTime(reindeer, 2503)).sort((a, b) => a - b).pop();
}

const distanceForTick = (reindeer: Reindeer, tick: number) => {
  const timeForCycle = reindeer.runTime + reindeer.restTime;
  const cycles = Math.floor(tick / timeForCycle);
  const restTime = tick - (cycles * timeForCycle);

  if(restTime >= reindeer.runTime) {
    return 0;
  } else {
    return reindeer.speed;
  }
}

const goB = (input) => {
  const lines = splitToLines(input);
  const reindeerList = lines.map(line => parseReindeer(line));

  const reindeerPoints: Record<string, number> = {};
  const reindeerDistance: Record<string, number> = {};

  for(let reindeer of reindeerList) {
    reindeerDistance[reindeer.name] = 0;
  }

  for(let i = 0; i < 2503; i++) {
    for(let reindeerName of Object.keys(reindeerDistance)) {
      const reindeer = reindeerList.find(reindeerWithName => reindeerWithName.name === reindeerName);

      reindeerDistance[reindeerName] = reindeerDistance[reindeerName] + distanceForTick(reindeer, i);
    }

    let highestDistanceReindeerList: string[] = [];
    let highestDistance: number = 0;

    for(let reindeerName of Object.keys(reindeerDistance)) {
      let distance = reindeerDistance[reindeerName];

      if(distance > highestDistance) {
        highestDistance = distance;
        highestDistanceReindeerList = [reindeerName]
      } else if(distance === highestDistance) {
        highestDistanceReindeerList.push(reindeerName);
      }
    }

    for(let reindeerName of highestDistanceReindeerList) {
      reindeerPoints[reindeerName] = reindeerPoints[reindeerName] ? reindeerPoints[reindeerName] + 1 : 1;
    }
  }

  return Object.values(reindeerPoints).sort((a, b) => a - b).pop()
}

/* Tests */

test(goB(readInputFromSpecialFile("testInput.txt")), 689) // Needs a Run Time of 1000 Steps instead of 2503

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
