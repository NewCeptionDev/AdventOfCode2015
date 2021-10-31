import {test, readInput} from "../utils/index"

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum OPERATIONS {
    ON,
    OFF,
    TOGGLE
}

const updateGrid = (input: string, method: number) => {
    const grid = {}

    const lines = input.split("\n")

    for (let line of lines) {
        if (line === "") {
            continue;
        }

        let parts = line.split("through");

        let firstNumbersString = parts[0].trim().split(" ");
        let firstNumbers = firstNumbersString[firstNumbersString.length - 1].split(",")

        let fromX = parseInt(firstNumbers[0])
        let fromY = parseInt(firstNumbers[1])

        let secondNumbersString = parts[1].trim().split(" ");
        let secondNumbers = secondNumbersString[secondNumbersString.length - 1].split(",")

        let toX = parseInt(secondNumbers[0])
        let toY = parseInt(secondNumbers[1])

        let operation: OPERATIONS;

        if (firstNumbersString[0] === "toggle") {
            operation = OPERATIONS.TOGGLE;
        } else if (firstNumbersString[0] === "turn") {
            if (firstNumbersString[1] === "on") {
                operation = OPERATIONS.ON;
            } else if (firstNumbersString[1] === "off") {
                operation = OPERATIONS.OFF;
            }
        }

        for (let y = fromY; y <= toY; y++) {
            let row = grid[y] !== undefined ? grid[y] : {}

            for (let x = fromX; x <= toX; x++) {
                switch (operation) {
                    case OPERATIONS.ON:
                        row[x] = onOperation(row[x], method)
                        break;
                    case OPERATIONS.OFF:
                        row[x] = offOperation(row[x], method)
                        break;
                    case OPERATIONS.TOGGLE:
                        row[x] = toggleOperation(row[x], method)
                        break;
                }
            }

            grid[y] = row;
        }
    }

    return grid;
}

const onOperation = (current: number, method: number) => {
    if(method === 1){
        return 1
    } else if(method === 2){
        if(current !== undefined){
            return current + 1
        } else {
            return 1
        }
    }
}

const offOperation = (current: number, method: number) => {
    if(method === 1){
        return 0
    } else if(method === 2){
        if(current !== undefined && current > 0){
            return current - 1
        } else {
            return 0
        }
    }
}

const toggleOperation = (current: number, method: number) => {

    if(method === 1) {
        if (current !== undefined && current === 1) {
            return 0
        } else {
            return 1
        }
    } else if(method === 2){
        if(current !== undefined){
            return current + 2
        } else {
            return 2
        }
    }
}

const goA = (input) => {
    let grid = updateGrid(input, 1);

    let litLights = 0

    for(let y of Object.values(grid)){
        for(let x of Object.values(y)){
            if(x === 1){
                litLights++;
            }
        }
    }

    return litLights
}

const goB = (input) => {
    let grid = updateGrid(input, 2);

    let litLights = 0

    for(let y of Object.values(grid)){
        for(let x of Object.values(y)){
           litLights += x;
        }
    }

    return litLights
}

/* Tests */

test(goA("turn on 0,0 through 999,999"), 1000000)
test(goA("toggle 0,0 through 999,0"), 1000)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
