import { test, readInput } from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Item {
  name: string;
  costs: number;
  damage: number;
  armor: number;
}

interface Entity {
  hp: number;
  damage: number;
  armor: number
}

const AVAILABLE_WEAPONS: Item[] = [
  {
    name: "Dagger",
    costs: 8,
    damage: 4,
    armor: 0
  },
  {
    name: "Shortsword",
    costs: 10,
    damage: 5,
    armor: 0
  },
  {
    name: "Warhammer",
    costs: 25,
    damage: 6,
    armor: 0
  },
  {
    name: "Longsword",
    costs: 40,
    damage: 7,
    armor: 0
  },
  {
    name: "Greataxe",
    costs: 74,
    damage: 8,
    armor: 0
  }
]

const AVAILABLE_ARMOR: Item[] = [
  {
    name: "Leather",
    costs: 13,
    damage: 0,
    armor: 1
  },
  {
    name: "Chainmail",
    costs: 31,
    damage: 0,
    armor: 2
  },
  {
    name: "Splintmail",
    costs: 53,
    damage: 0,
    armor: 3
  },
  {
    name: "Bandedmail",
    costs: 75,
    damage: 0,
    armor: 4
  },
  {
    name: "Platemail",
    costs: 102,
    damage: 0,
    armor: 5
  },
  {
    name: "No Armor",
    costs: 0,
    damage: 0,
    armor: 0
  }
]

const AVAILABLE_RINGS: Item[] = [
  {
    name: "Damage +1",
    costs: 25,
    damage: 1,
    armor: 0
  },
  {
    name: "Damage +2",
    costs: 50,
    damage: 2,
    armor: 0
  },
  {
    name: "Damage +3",
    costs: 100,
    damage: 3,
    armor: 0
  },
  {
    name: "Defense +1",
    costs: 20,
    damage: 0,
    armor: 1
  },
  {
    name: "Defense +2",
    costs: 40,
    damage: 0,
    armor: 2
  },
  {
    name: "Defense +3",
    costs: 80,
    damage: 0,
    armor: 3
  }
]

const cloneEntity = (entity: Entity): Entity => {
  return {
    hp: entity.hp,
    damage: entity.damage,
    armor: entity.armor
  }
}

const parseBoss = (lines: string[]): Entity => {
  return {
    hp: parseInt(lines[0].split(":")[1].trim()),
    damage: parseInt(lines[1].split(":")[1].trim()),
    armor: parseInt(lines[2].split(":")[1].trim())
  }
}

const calculateDamage = (attackDamage: number, armor: number): number => {
  let damage = attackDamage - armor;

  if(damage < 1) {
    damage = 1;
  }
  return damage
}

const calculateIfPlayerWinsMatch = (player: Entity, boss: Entity): boolean => {
  while(player.hp > 0 && boss.hp > 0) {
    boss.hp -= calculateDamage(player.damage, boss.armor);
    player.hp -= calculateDamage(boss.damage, player.armor);
  }

  return boss.hp <= 0
}

const calculateAllRingCombinations = (): Item[][] => {
  const possibleRingCombinations: Item[][] = [];

  for(let i = 0; i < AVAILABLE_RINGS.length; i++) {
    for(let j = i + 1; j < AVAILABLE_RINGS.length; j++) {
      possibleRingCombinations.push([AVAILABLE_RINGS[i], AVAILABLE_RINGS[j]]);
    }
    possibleRingCombinations.push([AVAILABLE_RINGS[i]]);
  }
  possibleRingCombinations.push([])

  return possibleRingCombinations;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const boss = parseBoss(lines);

  const possibleRingCombinations: Item[][] = calculateAllRingCombinations();

  let lowestCost = Number.MAX_SAFE_INTEGER;

  for(let weapon = 0; weapon < AVAILABLE_WEAPONS.length; weapon++) {
    for(let armor = 0; armor < AVAILABLE_ARMOR.length; armor++) {
      for(let ringCombination = 0; ringCombination < possibleRingCombinations.length; ringCombination++) {
        const player = {
          hp: 100,
          damage: AVAILABLE_WEAPONS[weapon].damage + possibleRingCombinations[ringCombination].map(elem => elem.damage).reduce((previousValue, currentValue) => previousValue + currentValue, 0),
          armor:  AVAILABLE_ARMOR[armor].armor + possibleRingCombinations[ringCombination].map(elem => elem.armor).reduce((previousValue, currentValue) => previousValue + currentValue, 0),
        }

        const bossClone = cloneEntity(boss);

        if(calculateIfPlayerWinsMatch(player, bossClone)) {
          const equipmentCosts = AVAILABLE_WEAPONS[weapon].costs + AVAILABLE_ARMOR[armor].costs + possibleRingCombinations[ringCombination].map(elem => elem.costs).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

          if(equipmentCosts < lowestCost) {
            lowestCost = equipmentCosts;
          }
        }
      }
    }
  }

  return lowestCost
}

const goB = (input) => {
  const lines = splitToLines(input);
  const boss = parseBoss(lines);

  const possibleRingCombinations: Item[][] = calculateAllRingCombinations();

  let highestCost = Number.MIN_SAFE_INTEGER;

  for(let weapon = 0; weapon < AVAILABLE_WEAPONS.length; weapon++) {
    for(let armor = 0; armor < AVAILABLE_ARMOR.length; armor++) {
      for(let ringCombination = 0; ringCombination < possibleRingCombinations.length; ringCombination++) {
        const player = {
          hp: 100,
          damage: AVAILABLE_WEAPONS[weapon].damage + possibleRingCombinations[ringCombination].map(elem => elem.damage).reduce((previousValue, currentValue) => previousValue + currentValue, 0),
          armor:  AVAILABLE_ARMOR[armor].armor + possibleRingCombinations[ringCombination].map(elem => elem.armor).reduce((previousValue, currentValue) => previousValue + currentValue, 0),
        }

        const bossClone = cloneEntity(boss);

        if(!calculateIfPlayerWinsMatch(player, bossClone)) {
          const equipmentCosts = AVAILABLE_WEAPONS[weapon].costs + AVAILABLE_ARMOR[armor].costs + possibleRingCombinations[ringCombination].map(elem => elem.costs).reduce((previousValue, currentValue) => previousValue + currentValue, 0);

          if(equipmentCosts > highestCost) {
            highestCost = equipmentCosts;
          }
        }
      }
    }
  }

  return highestCost
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
