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

const spawn2CombatableUnits = () => {
    gameState = new GameState();
    unit.ticksUntilAttack = 0;
    unit = spawnUnit({ unit, gameState, player: player1, cell });

    enemyCell = grid.cellAt({ x: 1, y: 0 }) || new Cell();
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

Deno.test("throw error if enemy is out of range", () => {
    setup();
});

// spawn the unit somewhere else
// test different ranges
// enemy units gets out of range after moving
// spawn two enemy units
// spawn two friendly units
