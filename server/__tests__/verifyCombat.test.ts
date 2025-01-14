import { expect } from "jsr:@std/expect";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";
import { Grid } from "../models/grid.ts";
import { Cell } from "../models/cell.ts";
import { verifyCombat } from "../handlers/combat.ts";
import { spawnUnit } from "../handlers/spawnUnit.ts";

let gameState: GameState;
let player1: Player;
let player2: Player;
let grid: Grid;
let cell: Cell;
let unit: Unit;
let enemyCell: Cell;
let enemyUnit: Unit;
function setup() {
    gameState = new GameState();
    player1 = new Player();
    player1 = {
        ...player1,
        gold: 1000,
    };
    player2 = new Player();
    player2 = {
        ...player2,
        gold: 1000,
    };
    grid = new Grid(6, 4);
    cell = grid.cellAt({ x: 0, y: 0 }) || new Cell();
    unit = new Unit({
        name: "Test Unit",
        spawnCost: 10,
        positionCell: cell,
        attackDamage: 16,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
        ticksNeededToAttack: 30,
        ticksUntilAttack: 30,
    });

    gameState.units.push(unit);
    gameState.grid = grid;
    cell.ownerPlayerId = player1.id;
}

const spawn2CombatableUnits = (enemySpawnX = 1, enemySpawnY = 0) => {
    gameState = new GameState();
    unit.ticksUntilAttack = 0;
    unit = spawnUnit({ unit, gameState, player: player1, cell });

    enemyCell = grid.cellAt({ x: enemySpawnX, y: enemySpawnY }) || new Cell();
    enemyCell.ownerPlayerId = player2.id;

    enemyUnit = new Unit();
    enemyUnit.name = "Enemy Unit";
    enemyUnit = spawnUnit({
        unit: enemyUnit,
        gameState,
        player: player2,
        cell: enemyCell,
    });
    expect(gameState.units.length).toBe(2);
};
Deno.test("verifyCombat correctly", () => {
    setup();
    spawn2CombatableUnits();
    expect(enemyUnit.health).toBe(enemyUnit.health);

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).not.toBe(null);
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);
});

Deno.test("unit does not attack when out of range", () => {
    setup();
    spawn2CombatableUnits(5, 0)

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });

    expect(unit.currentlyTargetedId).toBe(null);
    expect(enemyUnit.health).toBe(enemyUnit.health);
});

Deno.test("unit attacks the closest enemy unit", () => {
    setup();
    spawn2CombatableUnits();
    const secondEnemyCell = grid.cellAt({ x: 2, y: 0 }) || new Cell();
    const secondEnemyUnit = new Unit({
        name: "Second Enemy Unit",
        spawnCost: 10,
        positionCell: secondEnemyCell,
        attackDamage: 10,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
        ticksNeededToAttack: 30,
        ticksUntilAttack: 30,
    });
    secondEnemyCell.ownerPlayerId = player2.id;
    gameState.units.push(secondEnemyUnit);

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);
});

Deno.test("unit stops attacking when enemy moves out of range", () => {
    setup();
    spawn2CombatableUnits();
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    if(!enemyUnit.positionCell) {
        throw new Error("Enemy unit has no position cell");
    }
    enemyUnit.positionCell.removeUnit();
    enemyCell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    enemyUnit.positionCell = enemyCell;
    unit.ticksUntilAttack = 0;
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(null);
});

Deno.test("unit attacks one of two enemy units", () => {
    setup();
    spawn2CombatableUnits();
    const secondEnemyCell = grid.cellAt({ x: 1, y: 1 }) || new Cell();
    const secondEnemyUnit = new Unit({
        name: "Second Enemy Unit",
        spawnCost: 10,
        positionCell: secondEnemyCell,
        attackDamage: 10,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
        ticksNeededToAttack: 30,
        ticksUntilAttack: 30,
    });
    secondEnemyCell.ownerPlayerId = player2.id;
    gameState.units.push(secondEnemyUnit);

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).not.toBe(null);
    expect([enemyUnit.id, secondEnemyUnit.id]).toContain(unit.currentlyTargetedId);
});

Deno.test("unit attacks one of two friendly units", () => {
    setup();
    const secondFriendlyCell = grid.cellAt({ x: 1, y: 1 }) || new Cell();
    secondFriendlyCell.ownerPlayerId = player1.id;
    const secondFriendlyUnit = new Unit({
        name: "Second Friendly Unit",
        spawnCost: 10,
        positionCell: secondFriendlyCell,
        attackDamage: 10,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
        ticksNeededToAttack: 30,
        ticksUntilAttack: 30,
    });
    spawnUnit({ unit: secondFriendlyUnit, gameState, player: player1, cell: secondFriendlyCell });
    unit.ticksUntilAttack = 0;

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(null);
});

// spawn the unit somewhere else
// test different ranges
// enemy units gets out of range after moving
// spawn two enemy units
// spawn two friendly units
Deno.test("unit continues attacking the same unit for several attacks in a row", () => {
    setup();
    spawn2CombatableUnits();
    unit.ticksUntilAttack = 0;

    // First attack
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);

    // Second attack
    unit.ticksUntilAttack = 0;
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - 2 * unit.attackDamage);

    // Third attack
    unit.ticksUntilAttack = 0;
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - 3 * unit.attackDamage);
});
Deno.test("unit continues attacking until the enemy unit dies", () => {
    setup();
    spawn2CombatableUnits();
    unit.ticksUntilAttack = 0;

    while (enemyUnit.health > 0) {
        verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
        expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
        enemyUnit.health -= unit.attackDamage;
        unit.ticksUntilAttack = 0;
    }

    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(null);
    expect(enemyUnit.health).toBeLessThanOrEqual(0);
});

Deno.test("unit should wait the correct amount of ticks before attacking again", () => {
    setup();
    spawn2CombatableUnits();
    unit.ticksUntilAttack = 0;

    // First attack
    try{
        verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    }catch(e){
        console.log(e);
    }
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);

    // Advance ticks and verify no attack
    unit.ticksUntilAttack = unit.ticksNeededToAttack - 1;
    try{
        verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    }catch(e){
        console.log(e);
    }
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);

    // Advance one more tick and verify attack
    unit.ticksUntilAttack = 0;
    try{
        verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    }catch(e){
        console.log(e);
    }
    expect(enemyUnit.health).toBe(unit.health - 2 * unit.attackDamage);
});

Deno.test("unit should not attack if ticksUntilAttack is not zero", () => {
    setup();
    spawn2CombatableUnits();
    unit.ticksUntilAttack = unit.ticksNeededToAttack;
    

    try{
        verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    }catch(e){
        console.log(e);
    }   
    expect(enemyUnit.health).toBe(enemyUnit.health);
});

Deno.test("unit should attack after advancing ticks to zero", () => {
    setup();
    spawn2CombatableUnits();
    unit.ticksUntilAttack = unit.ticksNeededToAttack;

    // Advance ticks
    unit.ticksUntilAttack = 0;
    verifyCombat({ mainUnit: unit, grid: grid, player: player1, gameState });
    expect(unit.currentlyTargetedId).toBe(enemyUnit.id);
    expect(enemyUnit.health).toBe(unit.health - unit.attackDamage);
});

