import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

enum INSTRUCTION {
  HALF,
  TRIPLE,
  INCREMENT,
  JUMP,
  JUMP_IF_EVEN,
  JUMP_IF_ONE
}

interface FullInstruction {
  instruction: INSTRUCTION;
  register?: string;
  offset?: number;
}

const parseInstruction = (representation: string): INSTRUCTION => {
  switch (representation) {
    case "hlf":
      return INSTRUCTION.HALF;
    case "tpl":
      return INSTRUCTION.TRIPLE;
    case "inc":
      return INSTRUCTION.INCREMENT;
    case "jmp":
      return INSTRUCTION.JUMP;
    case "jie":
      return INSTRUCTION.JUMP_IF_EVEN;
    case "jio":
      return INSTRUCTION.JUMP_IF_ONE;
  }
}

const parseFullInstruction = (line: string): FullInstruction => {
  const split = line.split(" ");
  const instruction = parseInstruction(split[0])

  switch (instruction) {
    case INSTRUCTION.JUMP:
      return {
        instruction: INSTRUCTION.JUMP,
        offset: parseInt(split[1])
      }
    case INSTRUCTION.JUMP_IF_EVEN:
    case INSTRUCTION.JUMP_IF_ONE:
      return {
        instruction: instruction,
        register: split[1].substr(0, 1),
        offset: parseInt(split[2])
      }
    case INSTRUCTION.HALF:
    case INSTRUCTION.INCREMENT:
    case INSTRUCTION.TRIPLE:
      return {
        instruction: instruction,
        register: split[1]
      }
  }
}

const runMachineToEnd = (instructionList: FullInstruction[], regA: number, regB: number): number => {
  let registerA = regA;
  let registerB = regB;

  for(let i = 0; i < instructionList.length; i++) {
    switch (instructionList[i].instruction) {
      case INSTRUCTION.HALF:
        if(instructionList[i].register === "a") {
          registerA = Math.floor(registerA / 2);
        } else {
          registerB = Math.floor(registerB / 2);
        }
        break;
      case INSTRUCTION.TRIPLE:
        if(instructionList[i].register === "a") {
          registerA = registerA * 3;
        } else {
          registerB = registerB * 3;
        }
        break;
      case INSTRUCTION.INCREMENT:
        if(instructionList[i].register === "a") {
          registerA++;
        } else {
          registerB++;
        }
        break;
      case INSTRUCTION.JUMP:
        i = i + instructionList[i].offset - 1;
        break;
      case INSTRUCTION.JUMP_IF_EVEN:
        if(instructionList[i].register === "a") {
          i = registerA % 2 === 0 ? i + instructionList[i].offset - 1 : i;
        } else {
          i = registerB % 2 === 0 ? i + instructionList[i].offset - 1 : i;
        }
        break;
      case INSTRUCTION.JUMP_IF_ONE:
        if(instructionList[i].register === "a") {
          i = registerA === 1 ? i + instructionList[i].offset - 1 : i;
        } else {
          i = registerB === 1 ? i + instructionList[i].offset - 1 : i;
        }
        break;
    }
  }

  return registerB
}

const goA = (input) => {
  const lines = splitToLines(input);
  const instructionList: FullInstruction[] = lines.map(line => parseFullInstruction(line));

  return runMachineToEnd(instructionList, 0, 0)
}

const goB = (input) => {
  const lines = splitToLines(input);
  const instructionList: FullInstruction[] = lines.map(line => parseFullInstruction(line));

  return runMachineToEnd(instructionList, 1, 0)
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
