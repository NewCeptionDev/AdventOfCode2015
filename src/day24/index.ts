import {test, readInput} from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const arrEqual = (arr1: number[], arr2: number[]): boolean => {
    let equal = arr1.length === arr2.length;

    for (let i = 0; i < arr1.length && equal; i++) {
        equal = arr1[i] === arr2[i];
    }

    return equal;
}

const findAllConstellationsForWeight = (targetWeight: number, possibilities: number[], maxLength: number): number[][] => {
    possibilities = possibilities.sort((a, b) => b - a);

    if (possibilities.includes(targetWeight)) {
        return [[targetWeight]]
    }

    if(maxLength === 0){
        return [];
    }

    const constellations = [];

    for (let i = 0; i < possibilities.length; i++) {
        if (possibilities[i] < targetWeight) {
            const newPossibilities = [...possibilities];
            newPossibilities.splice(i, 1);

            const results = findAllConstellationsForWeight(targetWeight - possibilities[i], newPossibilities, maxLength - 1);

            const lowestConstellationLength = results.filter(result => maxLength > 0 ? result.length <= maxLength : true).map(result => result.length).sort((a, b) => a - b)[0]
            if(lowestConstellationLength) {
                maxLength = lowestConstellationLength
            }

            results.filter(result => result.length === lowestConstellationLength).forEach(result => {
                result.push(possibilities[i]);
                result = result.sort((a, b) => a - b);

                if (constellations.every(constellation => !arrEqual(constellation, result))) {
                    constellations.push(result);
                }
            })
        }
    }

    return constellations
}

const calculateQuantumEntanglement = (constellation: number[]): number => {
    return constellation.reduce((previousValue, currentValue) => previousValue * currentValue, 1);
}

const goA = (input) => {
    const lines = splitToLines(input);

    const weights: number[] = lines.map(line => parseInt(line.trim()));
    const groupWeight = weights.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / 3;

    const constellationsForFirstGroup = findAllConstellationsForWeight(groupWeight, [...weights], -1);

    let lowestSizeConstellations = [];
    let lowestSize = Number.MAX_SAFE_INTEGER;

    for (let constellation of constellationsForFirstGroup) {
        if (constellation.length < lowestSize) {
            lowestSize = constellation.length;
            lowestSizeConstellations = [constellation];
        } else if (constellation.length === lowestSize) {
            lowestSizeConstellations.push(constellation);
        }
    }

    return lowestSizeConstellations.map(constellation => calculateQuantumEntanglement(constellation)).sort((a, b) => a - b)[0]
}

const goB = (input) => {
    const lines = splitToLines(input);

    const weights: number[] = lines.map(line => parseInt(line.trim()));
    const groupWeight = weights.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / 4;

    let constellationsForFirstGroup = findAllConstellationsForWeight(groupWeight, [...weights], -1);

    let lowestSizeConstellations = [];
    let lowestSize = Number.MAX_SAFE_INTEGER;

    for (let constellation of constellationsForFirstGroup) {
        if (constellation.length < lowestSize) {
            lowestSize = constellation.length;
            lowestSizeConstellations = [constellation];
        } else if (constellation.length === lowestSize) {
            lowestSizeConstellations.push(constellation);
        }
    }

    return lowestSizeConstellations.map(constellation => calculateQuantumEntanglement(constellation)).sort((a, b) => a - b)[0]
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt")), 99)
test(goB(readInputFromSpecialFile("testInput.txt")), 44)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
