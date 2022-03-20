import { test, readInput } from "../utils/index"
import {readInputFromSpecialFile, splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

const MAX_INGREDIENT_AMOUNT = 100;

interface Ingredient {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
}

const parseIngredient = (line: string): Ingredient => {
  const nameStats = line.split(":");
  const singleStats = nameStats[1].trim().split(" ");

  return {
    name: nameStats[0].trim(),
    capacity: parseInt(singleStats[1].substr(0, singleStats[1].length - 1)),
    durability: parseInt(singleStats[3].substr(0, singleStats[3].length - 1)),
    flavor: parseInt(singleStats[5].substr(0, singleStats[5].length - 1)),
    texture: parseInt(singleStats[7].substr(0, singleStats[7].length - 1)),
    calories: parseInt(singleStats[9]),
  }
}

const calculateScore = (ingredients: Ingredient[], ingredientAmounts: number[]) => {
  let capacityScore = 0;
  let durabilityScore = 0;
  let flavorScore = 0;
  let textureScore = 0;

  for(let i = 0; i < ingredients.length; i++) {
    capacityScore += ingredients[i].capacity * ingredientAmounts[i];
    durabilityScore += ingredients[i].durability * ingredientAmounts[i];
    flavorScore += ingredients[i].flavor * ingredientAmounts[i];
    textureScore += ingredients[i].texture * ingredientAmounts[i];
  }

  if(capacityScore < 0) {
    capacityScore = 0;
  }

  if(durabilityScore < 0) {
    durabilityScore = 0;
  }

  if(flavorScore < 0) {
    flavorScore = 0;
  }

  if(textureScore < 0) {
    textureScore = 0;
  }

  return capacityScore * durabilityScore * flavorScore * textureScore;
}

const calculateScoreWithCaloriesLimit = (ingredients: Ingredient[], ingredientAmounts: number[]) => {
  let calories = 0;

  for(let i = 0; i < ingredients.length; i++) {
    calories += ingredients[i].calories * ingredientAmounts[i];
  }

  return calories === 500 ? calculateScore(ingredients, ingredientAmounts) : 0;
}

const recursivelyCheckAllPossibilities = (ingredientToDo: Ingredient[], ingredients: Ingredient[], ingredientAmounts: number[], noCaloriesLimit: boolean): number[] => {
  const scores: number[] = [];

  if(ingredientToDo.length === 0){
    if(ingredientAmounts.reduce((previousValue, currentValue) => previousValue + currentValue) !== MAX_INGREDIENT_AMOUNT) {
      return [];
    } else {
      return [noCaloriesLimit ? calculateScore(ingredients, ingredientAmounts) : calculateScoreWithCaloriesLimit(ingredients, ingredientAmounts)]
    }
  }

  const leftOverAmounts = MAX_INGREDIENT_AMOUNT - ingredientAmounts.reduce((previousValue, currentValue) => previousValue + currentValue, 0);

  const newIngredientsToDo = ingredientToDo.slice(1);
  for(let i = leftOverAmounts; i >= 0; i--) {
    const newAmounts = [...ingredientAmounts];
    newAmounts.push(i);

    scores.push(...recursivelyCheckAllPossibilities(newIngredientsToDo, ingredients, newAmounts, noCaloriesLimit))
  }

  return scores;
}

const goA = (input) => {
  const lines = splitToLines(input);
  const ingredients: Ingredient[] = lines.map(line => parseIngredient(line));

  const scores = recursivelyCheckAllPossibilities([...ingredients], ingredients, [], true);

  return scores.sort((a, b) => a - b).pop()
}

const goB = (input) => {
  const lines = splitToLines(input);
  const ingredients: Ingredient[] = lines.map(line => parseIngredient(line));

  const scores = recursivelyCheckAllPossibilities([...ingredients], ingredients, [], false);

  return scores.sort((a, b) => a - b).pop()
}

/* Tests */

test(goA(readInputFromSpecialFile("testInput.txt")), 62842880)

/* Results */

console.time("Time")
const resultA = goA(input)
const resultB = goB(input)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
