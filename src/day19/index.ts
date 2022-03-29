import {test, readInput} from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Instruction {
    from: string;
    to: string;
}

const parseInstruction = (line: string): Instruction => {
    const parts = line.split("=>");

    return {
        from: parts[0].trim(),
        to: parts[1].trim()
    }
}

const goA = (input) => {
    const lines = splitToLines(input);
    const neededMolecule = lines.pop().trim();

    const instructions: Instruction[] = lines.filter(line => line !== "").map(line => parseInstruction(line));

    const distinctCreations: Set<String> = new Set<String>();

    for (let i = 0; i < neededMolecule.length; i++) {
        const startPart = neededMolecule.substring(0, i);
        const endPart = neededMolecule.substring(i + 1, neededMolecule.length);

        let fittingInstructions = instructions.filter(instruction => instruction.from === neededMolecule[i]);

        if (fittingInstructions) {
            for (let instruction of fittingInstructions) {
                distinctCreations.add(startPart + instruction.to + endPart);
            }
        }

        if (i < neededMolecule.length - 1) {
            fittingInstructions = instructions.filter(instruction => instruction.from === neededMolecule[i] + neededMolecule[i + 1])
        }

        if (fittingInstructions) {
            for (let instruction of fittingInstructions) {
                distinctCreations.add(startPart + instruction.to + endPart.substring(1));
            }
        }
    }

    return distinctCreations.size
}

const goB = (input) => {
    const lines = splitToLines(input);
    const startMolecule = lines.pop().trim();

    let neededMolecule;

    const instructions: Instruction[] = lines.filter(line => line !== "").map(line => parseInstruction(line));

    let steps = -1;

    while(steps === -1) {
        steps = 0;
        neededMolecule = startMolecule;
        while (neededMolecule !== "e") {
            const possibleReplacements: Instruction[] = [];
            for (let instruction of instructions) {
                if (neededMolecule.includes(instruction.to) && (instruction.from !== "e" || neededMolecule.length === instruction.to.length)) {
                    possibleReplacements.push(instruction);
                }
            }

            if (possibleReplacements.length > 0) {
                // Using random to find correct breakdown
                const usedInstructionIndex = Math.floor(Math.random() * possibleReplacements.length);
                const usedInstruction = possibleReplacements[usedInstructionIndex]

                let lastIndex = neededMolecule.lastIndexOf(usedInstruction.to);
                let sizeOfReplacement = usedInstruction.to.length;
                neededMolecule = neededMolecule.substring(0, lastIndex) + usedInstruction.from + neededMolecule.substring(lastIndex + sizeOfReplacement, neededMolecule.length);
                steps++;
            } else {
                steps = -1;
                break;
            }
        }
    }

    return steps
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt")), 4)
test(goA(readInputFromSpecialFile("testInput2.txt")), 7)
test(goB(readInputFromSpecialFile("testInput3.txt")), 3)
test(goB(readInputFromSpecialFile("testInput4.txt")), 6)

/* Results */

console.time("Time")
// const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

// console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
