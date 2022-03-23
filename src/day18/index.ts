import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const parseLightRow = (line: string): number[] => {
  return [...line.trim()].map(char => char === "#" ? 1 : 0);
}

const getCountOfLitNeighbours = (x: number, y: number, grid: number[][]) => {
  let lit = 0;

  if(x - 1 >= 0) {
    if(y - 1 >= 0) {
      lit += grid[y - 1][x - 1];
    }

    if(y + 1 < grid.length) {
      lit += grid[y + 1][x - 1]
    }

    lit += grid[y][x - 1]
  }

  if(x + 1 < grid[0].length) {
    if(y - 1 >= 0) {
      lit += grid[y - 1][x + 1];
    }

    if(y + 1 < grid.length) {
      lit += grid[y + 1][x + 1]
    }

    lit += grid[y][x + 1];
  }

  if(y - 1 >= 0){
    lit += grid[y - 1][x]
  }

  if(y + 1 < grid.length) {
    lit += grid[y + 1][x]
  }

  return lit;
}

const updateLights = (grid: number[][]): number[][] => {

  const updatedGrid: number[][] = [];

  for(let y = 0; y < 100; y++) {
    const updatedRow: number[] = [];

    for(let x = 0; x < 100; x++) {
      const litNeighbours = getCountOfLitNeighbours(x, y, grid);
      updatedRow.push(grid[y][x] === 1 ? (litNeighbours === 2 || litNeighbours === 3) ? 1 : 0 : litNeighbours === 3 ? 1 : 0)
    }
    updatedGrid.push(updatedRow)
  }

  return updatedGrid;
}

const updateLightsWithCornersAlwaysOn = (grid: number[][]): number[][] => {

  const updatedGrid: number[][] = [];

  for(let y = 0; y < 100; y++) {
    const updatedRow: number[] = [];

    for(let x = 0; x < 100; x++) {
      const litNeighbours = getCountOfLitNeighbours(x, y, grid);
      updatedRow.push(grid[y][x] === 1 ? (litNeighbours === 2 || litNeighbours === 3) ? 1 : 0 : litNeighbours === 3 ? 1 : 0)
    }
    updatedGrid.push(updatedRow)
  }

  // Set Corners to on
  updatedGrid[0][0] = 1;
  updatedGrid[0][grid[0].length - 1] = 1;
  updatedGrid[grid.length - 1][0] = 1;
  updatedGrid[grid.length - 1][grid[0].length - 1] = 1;

  return updatedGrid;
}

const goA = (input, steps: number) => {
  const lines = splitToLines(input);
  let grid: number[][] = lines.map(line => parseLightRow(line));

  for (let i = 0; i < steps; i++) {
    grid = updateLights(grid);
  }

  return grid.map(row => row.reduce((previousValue, currentValue) => previousValue + currentValue, 0)).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
}

const goB = (input, steps) => {
  const lines = splitToLines(input);
  let grid: number[][] = lines.map(line => parseLightRow(line));

  // Set Corners to on
  grid[0][0] = 1;
  grid[0][grid[0].length - 1] = 1;
  grid[grid.length - 1][0] = 1;
  grid[grid.length - 1][grid[0].length - 1] = 1;

  for (let i = 0; i < steps; i++) {
    grid = updateLightsWithCornersAlwaysOn(grid);
  }

  return grid.map(row => row.reduce((previousValue, currentValue) => previousValue + currentValue, 0)).reduce((previousValue, currentValue) => previousValue + currentValue, 0)
}

/* Tests */

// test()

/* Results */

console.time("Time")
const resultA = goA(input, 100)
const resultB = goB(input, 100)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
