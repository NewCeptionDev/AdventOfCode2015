import {test, readInput} from "../utils/index"
import {splitToLines} from "../utils/readInput";

const prepareInput = (rawInput: string) => rawInput

const input = prepareInput(readInput())

interface Entity {
    hp: number;
    damage: number;
    armor: number;
    mana: number;
}

interface Spell {
    name: string;
    costs: number;
    damage?: number;
    heal?: number;
    effectDuration?: number;
    armorGain?: number;
    damageOverTime?: number;
    manaOverTime?: number;
}

interface GameState {
    player: Entity,
    boss: Entity,
    activeEffects: Spell[]
    manaCosts: number,
    finished: boolean
}

const SPELLS: Spell[] = [
    {
        name: "Magic Missile",
        costs: 53,
        damage: 4
    },
    {
        name: "Drain",
        costs: 73,
        damage: 2,
        heal: 2
    },
    {
        name: "Shield",
        costs: 113,
        effectDuration: 6,
        armorGain: 7
    },
    {
        name: "Poison",
        costs: 173,
        effectDuration: 6,
        damageOverTime: 3
    },
    {
        name: "Recharge",
        costs: 229,
        effectDuration: 5,
        manaOverTime: 101
    }
]

const cloneSpell = (spell: Spell): Spell => {
    return {
        name: spell.name,
        costs: spell.costs,
        damage: spell.damage,
        heal: spell.heal,
        effectDuration: spell.effectDuration,
        armorGain: spell.armorGain,
        damageOverTime: spell.damageOverTime,
        manaOverTime: spell.manaOverTime,
    }
}

const cloneEntity = (entity: Entity): Entity => {
    return {
        hp: entity.hp,
        damage: entity.damage,
        armor: entity.armor,
        mana: entity.mana
    }
}

const parseBoss = (lines: string[]): Entity => {
    return {
        hp: parseInt(lines[0].split(":")[1].trim()),
        damage: parseInt(lines[1].split(":")[1].trim()),
        armor: 0,
        mana: 0
    }
}

const effectsEqual = (effects1: Spell[], effects2: Spell[]): boolean => {
    let equal = effects1.length === effects2.length;

    for (let i = 0; i < effects1.length && equal; i++) {
        equal = effects1[i].name === effects2[i].name && effects1[i].effectDuration === effects2[i].effectDuration;
    }

    return equal;
}

const entitiesEqual = (entity1: Entity, entity2: Entity): boolean => {
    return entity1.hp === entity2.hp && entity1.mana === entity2.mana;
}

const calculateStatesAfterTurn = (states: GameState[], playerTurn: boolean, hardMode: boolean): GameState[] => {
    const newStates: GameState[] = [];

    for (let currentState of states) {
        if(hardMode) {
            currentState.player.hp -= 1;

            if(currentState.player.hp <= 0) {
                continue;
            }
        }

        for (let effect of currentState.activeEffects) {
            effect.effectDuration -= 1;

            if (effect.armorGain) {
                currentState.player.armor = effect.effectDuration > 0 ? effect.armorGain : 0;
            } else if (effect.damageOverTime) {
                currentState.boss.hp -= effect.damageOverTime;
            } else if (effect.manaOverTime) {
                currentState.player.mana += effect.manaOverTime;
            }
        }

        const nextRoundEffects = currentState.activeEffects.filter(effect => effect.effectDuration > 0);

        if (currentState.boss.hp <= 0) {
            if (!newStates.find(calculatedState => entitiesEqual(calculatedState.boss, currentState.boss) && entitiesEqual(calculatedState.player, currentState.player) && effectsEqual(calculatedState.activeEffects, nextRoundEffects) && calculatedState.manaCosts === currentState.manaCosts && calculatedState.finished)) {
                newStates.push({
                    boss: cloneEntity(currentState.boss),
                    player: cloneEntity(currentState.player),
                    activeEffects: nextRoundEffects,
                    manaCosts: currentState.manaCosts,
                    finished: true
                })
            }
        } else if (playerTurn) {
            for (let spell of SPELLS) {
                const newPlayer = cloneEntity(currentState.player);
                const newBoss = cloneEntity(currentState.boss);
                const effectsForBossRound = [...nextRoundEffects].map(castEffect => cloneSpell(castEffect));

                if (newPlayer.mana >= spell.costs && !nextRoundEffects.find(castSpell => castSpell.name === spell.name)) {
                    newPlayer.mana -= spell.costs;
                    if (spell.damage) {
                        newBoss.hp -= spell.damage;
                    }
                    if (spell.heal) {
                        newPlayer.hp += spell.heal;
                    }
                    if (spell.effectDuration) {
                        effectsForBossRound.push(cloneSpell(spell))
                    }

                    if (newBoss.hp <= 0 || newPlayer.hp > 0) {
                        if (!newStates.find(calculatedState => entitiesEqual(calculatedState.boss, newBoss) && entitiesEqual(calculatedState.player, newPlayer) && effectsEqual(calculatedState.activeEffects, effectsForBossRound) && calculatedState.manaCosts === currentState.manaCosts + spell.costs && calculatedState.finished === newBoss.hp <= 0)) {
                            newStates.push({
                                boss: cloneEntity(newBoss),
                                player: cloneEntity(newPlayer),
                                activeEffects: effectsForBossRound,
                                manaCosts: currentState.manaCosts + spell.costs,
                                finished: newBoss.hp <= 0
                            })
                        }
                    }
                }
            }

        } else {
            currentState.player.hp -= currentState.boss.damage <= currentState.player.armor ? 1 : currentState.boss.damage - currentState.player.armor;

            if ((currentState.player.hp > 0 || currentState.boss.hp <= 0) && !newStates.find(calculatedState => entitiesEqual(calculatedState.boss, currentState.boss) && entitiesEqual(calculatedState.player, currentState.player) && effectsEqual(calculatedState.activeEffects, nextRoundEffects) && calculatedState.manaCosts === currentState.manaCosts && calculatedState.finished === currentState.boss.hp <= 0)) {
                newStates.push({
                    boss: cloneEntity(currentState.boss),
                    player: cloneEntity(currentState.player),
                    activeEffects: nextRoundEffects,
                    manaCosts: currentState.manaCosts,
                    finished: currentState.boss.hp <= 0
                })
            }
        }
    }

    return newStates;
}

const goA = (input, playerHP: number, playerMana: number) => {
    const lines = splitToLines(input);
    const boss = parseBoss(lines);

    let states: GameState[] = [{
        player: {
            hp: playerHP,
            mana: playerMana,
            armor: 0,
            damage: 0,
        },
        boss: cloneEntity(boss),
        activeEffects: [],
        manaCosts: 0,
        finished: false
    }];

    let playerTurn = true;
    let smallestCosts = Number.MAX_SAFE_INTEGER;
    while (states.some(state => !state.finished)) {
        states = calculateStatesAfterTurn(states, playerTurn, false);
        playerTurn = !playerTurn;

        const currentSmallestCost = states.filter(state => state.finished).sort((a, b) => a.manaCosts - b.manaCosts)[0];

        if (currentSmallestCost || smallestCosts !== Number.MAX_SAFE_INTEGER) {
            if(currentSmallestCost && currentSmallestCost.manaCosts < smallestCosts) {
                smallestCosts = currentSmallestCost.manaCosts;
            }
            states = states.filter(state => !state.finished && state.manaCosts <= smallestCosts)
        }
    }

    return smallestCosts
}

const goB = (input, playerHP, playerMana) => {
    const lines = splitToLines(input);
    const boss = parseBoss(lines);

    let states: GameState[] = [{
        player: {
            hp: playerHP,
            mana: playerMana,
            armor: 0,
            damage: 0,
        },
        boss: cloneEntity(boss),
        activeEffects: [],
        manaCosts: 0,
        finished: false
    }];

    let playerTurn = true;
    let smallestCosts = Number.MAX_SAFE_INTEGER;
    while (states.some(state => !state.finished)) {
        states = calculateStatesAfterTurn(states, playerTurn, true);
        playerTurn = !playerTurn;

        const currentSmallestCost = states.filter(state => state.finished).sort((a, b) => a.manaCosts - b.manaCosts)[0];

        if (currentSmallestCost || smallestCosts !== Number.MAX_SAFE_INTEGER) {
            if(currentSmallestCost && currentSmallestCost.manaCosts < smallestCosts) {
                smallestCosts = currentSmallestCost.manaCosts;
            }
            states = states.filter(state => !state.finished && state.manaCosts <= smallestCosts)
        }
    }

    return smallestCosts
}

/* Tests */

test(goA("HP: 13\r\n Damage: 8", 10, 250), 226)
test(goA("HP: 14\r\n Damage: 8", 10, 250), 641)

/* Results */

console.time("Time")
const resultA = goA(input, 50, 500)
const resultB = goB(input, 50, 500)
console.timeEnd("Time")

console.log("Solution to part 1:", resultA)
console.log("Solution to part 2:", resultB)
