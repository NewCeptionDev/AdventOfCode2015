import { test, readInput } from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum Operation {
  NULL,
  AND,
  OR,
  LSHIFT,
  RSHIFT,
  NOT
}

interface Instruction {
  outputWire: string;
  inputWire1?: string;
  inputWire2?: string;
  inputConstant1?: number;
  inputConstant2?: number;
  op?: Operation;
}

const MAX_INT = 65535;

const parseOp = (opString: string): Operation => {
  switch (opString) {
    case "NOT": return Operation.NOT;
    case "AND": return Operation.AND;
    case "OR": return Operation.OR;
    case "LSHIFT": return Operation.LSHIFT;
    case "RSHIFT": return Operation.RSHIFT;
  }

  return null;
}

const updateNegative = (input: number): number => {
  return input < 0 ? input & MAX_INT : input;
}

const parseInput = (input: string[]): Instruction[]  => {
  const instructions: Instruction[] = [];

  for(let line of input) {
    const inOut: string[] = line.split("->");
    const inSplit: string[] = inOut[0].trim().split(" ")

    const outputWire = inOut[1].trim();

    switch (inSplit.length) {
      case 1:
        const isSingleWire = isNaN(parseInt(inSplit[0].trim()));

        if(isSingleWire) {
          instructions.push({
            outputWire: outputWire,
            inputWire1: inSplit[0].trim()
          })
        } else {
          instructions.push({
            outputWire: outputWire,
            inputConstant1: parseInt(inSplit[0].trim())
          })
        }
            break;
      case 2:
        const isWire = isNaN(parseInt(inSplit[1].trim()));

        if(isWire) {
          instructions.push({
            outputWire: outputWire,
            op: Operation.NOT,
            inputWire1: inSplit[1].trim()
          })
        } else {
          instructions.push({
            outputWire: outputWire,
            op: Operation.NOT,
            inputConstant1: parseInt(inSplit[1].trim())
          })
        }
        break;
      case 3:
        const op: Operation = parseOp(inSplit[1].trim());
        const isWire1 = isNaN(parseInt(inSplit[0].trim()));
        const isWire2 = isNaN(parseInt(inSplit[2].trim()));

        if(isWire1 && isWire2) {
          instructions.push({
            outputWire: outputWire,
            op: op,
            inputWire1: inSplit[0].trim(),
            inputWire2: inSplit[2].trim()
          })
        } else if(isWire1 && !isWire2) {
          instructions.push({
            outputWire: outputWire,
            op: op,
            inputWire1: inSplit[0].trim(),
            inputConstant2: parseInt(inSplit[2].trim())
          })
        } else if(!isWire1 && isWire2) {
          //Shouldn't happen but to keep program failsafe its in
          instructions.push({
            outputWire: outputWire,
            op: op,
            inputConstant1: parseInt(inSplit[0].trim()),
            inputWire2: inSplit[2].trim()
          })
        } else {
          //Shouldn't happen but to keep program failsafe its in
          instructions.push({
            outputWire: outputWire,
            op: op,
            inputConstant1: parseInt(inSplit[0].trim()),
            inputConstant2: parseInt(inSplit[2].trim())
          })
        }
    }
  }

  return instructions;
}

const notOperation = (current: number): number => {
  return updateNegative(~current);
}

const andOperation = (first: number, second: number): number => {
  return updateNegative(first & second);
}

const orOperation = (first: number, second: number): number => {
  return updateNegative(first | second);
}

const lShiftOperation = (first: number, second: number): number => {
  return updateNegative(first << second);
}

const rShiftOperation = (first: number, second: number): number => {
  return first >> second;
}

const goA = (input) => {
  const lines = splitToLines(input);

  let notComputableInstructions = parseInput(lines);
  const calculatedValues: Record<string, number> = {};

  while(notComputableInstructions.length > 0) {
    const newNotComputable: Instruction[] = [];
    for(let instruction of notComputableInstructions) {
      const wire1Computable = instruction.inputWire1 && calculatedValues[instruction.inputWire1] !== undefined;
      const wire2Computable = instruction.inputWire2 && calculatedValues[instruction.inputWire2] !== undefined;

      if(instruction.op === undefined && (instruction.inputConstant1 !== undefined || wire1Computable)) {
        if(wire1Computable) {
          calculatedValues[instruction.outputWire] = calculatedValues[instruction.inputWire1];
        } else {
          calculatedValues[instruction.outputWire] = instruction.inputConstant1;
        }
      } else {
        if(instruction.op === Operation.NOT && (wire1Computable || instruction.inputConstant1 !== undefined)) {
          if(wire1Computable) {
            calculatedValues[instruction.outputWire] = notOperation(calculatedValues[instruction.inputWire1]);
          } else {
            calculatedValues[instruction.outputWire] = notOperation(instruction.inputConstant1);
          }
        } else if((instruction.op === Operation.AND || instruction.op === Operation.OR) && ((wire1Computable && wire2Computable) || (wire1Computable && instruction.inputConstant2 !== undefined) || (instruction.inputConstant1 !== undefined && wire2Computable) || (instruction.inputConstant1 !== undefined && instruction.inputConstant2 !== undefined))) {
          if(instruction.op === Operation.AND) {
            if(wire1Computable && wire2Computable) {
              calculatedValues[instruction.outputWire] = andOperation(calculatedValues[instruction.inputWire1], calculatedValues[instruction.inputWire2]);
            } else if(wire1Computable) {
              calculatedValues[instruction.outputWire] = andOperation(calculatedValues[instruction.inputWire1], instruction.inputConstant2);
            } else if(wire2Computable) {
              calculatedValues[instruction.outputWire] = andOperation(instruction.inputConstant1, calculatedValues[instruction.inputWire2]);
            } else {
              calculatedValues[instruction.outputWire] = andOperation(instruction.inputConstant1, instruction.inputConstant2);
            }
          } else {
            if(wire1Computable && wire2Computable) {
              calculatedValues[instruction.outputWire] = orOperation(calculatedValues[instruction.inputWire1], calculatedValues[instruction.inputWire2]);
            } else if(wire1Computable) {
              calculatedValues[instruction.outputWire] = orOperation(calculatedValues[instruction.inputWire1], instruction.inputConstant2);
            } else if(wire2Computable) {
              calculatedValues[instruction.outputWire] = orOperation(instruction.inputConstant1, calculatedValues[instruction.inputWire2]);
            } else {
              calculatedValues[instruction.outputWire] = orOperation(instruction.inputConstant1, instruction.inputConstant2);
            }
          }
        } else if((instruction.op === Operation.LSHIFT || instruction.op === Operation.RSHIFT) && ((wire1Computable && instruction.inputConstant2 !== undefined) || (instruction.inputConstant1 !== undefined && wire2Computable) || (wire1Computable && wire2Computable) || (instruction.inputConstant1 !== undefined && instruction.inputConstant2 !== undefined))) {
          if(instruction.op === Operation.LSHIFT) {
            if(wire1Computable && wire2Computable) {
              calculatedValues[instruction.outputWire] = lShiftOperation(calculatedValues[instruction.inputWire1], calculatedValues[instruction.inputWire2]);
            } else if(wire1Computable) {
              calculatedValues[instruction.outputWire] = lShiftOperation(calculatedValues[instruction.inputWire1], instruction.inputConstant2);
            } else if(wire2Computable) {
              calculatedValues[instruction.outputWire] = lShiftOperation(instruction.inputConstant1, calculatedValues[instruction.inputWire2]);
            } else {
              calculatedValues[instruction.outputWire] = lShiftOperation(instruction.inputConstant1, instruction.inputConstant2);
            }
          } else {
            if(wire1Computable && wire2Computable) {
              calculatedValues[instruction.outputWire] = rShiftOperation(calculatedValues[instruction.inputWire1], calculatedValues[instruction.inputWire2]);
            } else if(wire1Computable) {
              calculatedValues[instruction.outputWire] = rShiftOperation(calculatedValues[instruction.inputWire1], instruction.inputConstant2);
            } else if(wire2Computable) {
              calculatedValues[instruction.outputWire] = rShiftOperation(instruction.inputConstant1, calculatedValues[instruction.inputWire2]);
            } else {
              calculatedValues[instruction.outputWire] = rShiftOperation(instruction.inputConstant1, instruction.inputConstant2);
            }
          }
        } else {
          newNotComputable.push(instruction);
        }
      }
    }
    notComputableInstructions = newNotComputable;
  }

  return calculatedValues["a"];
}

const goB = (input) => {
  // Copied input file from task 1 and changes assignment of b to the result of the first task for a (956)
  return goA(input);
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt")), 0)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(prepareInput(readInputFromSpecialFile("inputTask2.txt")))
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
