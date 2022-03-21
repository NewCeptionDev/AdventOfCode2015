import {test, readInput} from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface AuntCompounds {
    auntId: number;
    children?: number;
    cats?: number;
    samoyeds?: number;
    pomeranians?: number;
    akitas?: number;
    vizslas?: number;
    goldfish?: number;
    trees?: number;
    cars?: number;
    perfumes?: number;
}

const parseAunt = (input: string): AuntCompounds => {
    const auntId = parseInt(input.split(" ")[1].substr(0, input.split(" ")[1].length - 1));
    const compounds: string[] = input.substring(input.indexOf(":") + 1, input.length).trim().split(",");

    const parsedCompounds: Record<string, number> = {};

    for (let compound of compounds) {
        const split = compound.split(":");
        parsedCompounds[split[0].trim()] = parseInt(split[1].trim());
    }

    return {
        auntId: auntId,
        ...parsedCompounds
    }
}

const goA = (input) => {
    const lines = splitToLines(input);
    const aunts: AuntCompounds[] = lines.map(line => parseAunt(line));

    const searchedAunt = aunts.find(aunt => (aunt.children === undefined || aunt.children === 3)
        && (aunt.cats === undefined || aunt.cats === 7) && (aunt.samoyeds === undefined || aunt.samoyeds === 2)
        && (aunt.pomeranians === undefined|| aunt.pomeranians === 3) && (aunt.akitas === undefined || aunt.akitas === 0)
        && (aunt.vizslas === undefined || aunt.vizslas === 0) && (aunt.goldfish === undefined || aunt.goldfish === 5)
        && (aunt.trees === undefined || aunt.trees === 3) && (aunt.cars === undefined || aunt.cars === 2) && (aunt.perfumes === undefined || aunt.perfumes === 1));

    return searchedAunt.auntId;
}

const goB = (input) => {
    const lines = splitToLines(input);
    const aunts: AuntCompounds[] = lines.map(line => parseAunt(line));

    const searchedAunt = aunts.find(aunt => (aunt.children === undefined || aunt.children === 3)
        && (aunt.cats === undefined || aunt.cats > 7) && (aunt.samoyeds === undefined || aunt.samoyeds === 2)
        && (aunt.pomeranians === undefined || aunt.pomeranians < 3) && (aunt.akitas === undefined || aunt.akitas === 0)
        && (aunt.vizslas === undefined || aunt.vizslas === 0) && (aunt.goldfish === undefined || aunt.goldfish < 5)
        && (aunt.trees === undefined || aunt.trees > 3) && (aunt.cars === undefined || aunt.cars === 2) && (aunt.perfumes === undefined || aunt.perfumes === 1));


    return searchedAunt.auntId;
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
