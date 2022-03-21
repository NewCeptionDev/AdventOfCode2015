import {test, readInput} from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

interface Container {
    id: number;
    size: number;
}

const input = prepareInput(readInput())

const buildPossibleCombinationsFromList = (current: Container[], availableContainers: Container[]): Container[][] => {
    let combinations: Container[][] = [];

    for (let i = 0; i < availableContainers.length; i++) {
        if(!current.find(container => container.id === availableContainers[i].id)) {
            const newUsed = [...current, availableContainers[i]];

            combinations.push(newUsed);
        }
    }

    return combinations;
}

const arrayEqual = (arr1: number[], arr2: number[]): boolean => {
    let equal = arr1.length === arr2.length;

    for (let i = 0; i < arr1.length && equal; i++) {
        equal = arr1[i] === arr2[i]
    }
    return equal;
}

const goA = (input, amount: number) => {
    const lines = splitToLines(input);
    const containerSizes: Container[] = lines.map((line, index) =>  {
        return {
            id: index,
            size: parseInt(line)
        }
    });

    const combinationsForSize: Map<number, Container[][]> = new Map<number, Container[][]>();
    combinationsForSize.set(0, [[]]);

    for(let i = 0; i <= amount; i++) {
        const currentCombinations = combinationsForSize.get(i);

        for(let j = 0; currentCombinations && j < currentCombinations.length; j++) {
            const newCombinations = buildPossibleCombinationsFromList(currentCombinations[j], containerSizes);
            const sorted = newCombinations.map(newCombination => newCombination.sort((a, b) => a.id - b.id));

            for(let newCombination of sorted) {
                const size = newCombination.reduce((previousValue, currentValue) => previousValue + currentValue.size, 0)

                if(combinationsForSize.has(size) && !combinationsForSize.get(size).find(existing => arrayEqual(existing.map(container => container.id), newCombination.map(container => container.id)))) {
                    combinationsForSize.get(size).push(newCombination)
                } else if(!combinationsForSize.has(size)) {
                    combinationsForSize.set(size, [newCombination]);
                }
            }
        }
    }

    return combinationsForSize.get(amount).length
}

const goB = (input, amount) => {
    const lines = splitToLines(input);
    const containerSizes: Container[] = lines.map((line, index) =>  {
        return {
            id: index,
            size: parseInt(line)
        }
    });

    const combinationsForSize: Map<number, Container[][]> = new Map<number, Container[][]>();
    combinationsForSize.set(0, [[]]);

    for(let i = 0; i <= amount; i++) {
        const currentCombinations = combinationsForSize.get(i);

        for(let j = 0; currentCombinations && j < currentCombinations.length; j++) {
            const newCombinations = buildPossibleCombinationsFromList(currentCombinations[j], containerSizes);
            const sorted = newCombinations.map(newCombination => newCombination.sort((a, b) => a.id - b.id));

            for(let newCombination of sorted) {
                const size = newCombination.reduce((previousValue, currentValue) => previousValue + currentValue.size, 0)

                if(combinationsForSize.has(size) && !combinationsForSize.get(size).find(existing => arrayEqual(existing.map(container => container.id), newCombination.map(container => container.id)))) {
                    combinationsForSize.get(size).push(newCombination)
                } else if(!combinationsForSize.has(size)) {
                    combinationsForSize.set(size, [newCombination]);
                }
            }
        }
    }

    const combinationsForAmount = combinationsForSize.get(amount);

    let smallestAmountOfContainers = Number.MAX_SAFE_INTEGER;
    let countOfSmallestContainer = 1;
    for(let combination of combinationsForAmount) {
        if(combination.length < smallestAmountOfContainers) {
            smallestAmountOfContainers = combination.length;
            countOfSmallestContainer = 1
        } else if(combination.length === smallestAmountOfContainers) {
            countOfSmallestContainer++;
        }
    }

    return countOfSmallestContainer
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt"), 25), 4)

/* Results */

console.time("Time")
const resultA = goA(input, 150)
const resultB = goB(input, 150)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
