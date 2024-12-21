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
    unit = new Unit();
    unit = {
        ...unit,
        name: "Test Unit",
        spawnCost: 10,
        positionCell: cell,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
        ticksNeededToAttack: 30,
        ticksUntilAttack: 30,
    } as Unit;
    gameState.units.push(unit);
    gameState.grid = grid;
    cell.ownerPlayerId = player1.id;
}

const spawn2CombatableUnits = () => {
    gameState = new GameState();
    unit = new Unit();
    unit.name = "Test Unit";
    unit.ticksUntilAttack = 0;
    unit = spawnUnit({ unit, gameState, player: player1, cell });
    
    const enemyCell = grid.cellAt({ x: 1, y: 0 }) || new Cell();
    enemyCell.ownerPlayerId = player2.id;    

    let enemyUnit = new Unit();
    enemyUnit.name = "Enemy Unit";
    enemyUnit = spawnUnit({ unit: enemyUnit, gameState, player: player2, cell: enemyCell });
    expect(gameState.units.length).toBe(2);
}
Deno.test("verifyCombat correctly", () => {
    setup();
    spawn2CombatableUnits();
    
    verifyCombat({ mainUnit: unit, grid: grid, player: player1 });
});

Deno.test("throw error if enemy is out of range", () => {
    setup();

});

// spawn the unit somewhere else
// test different ranges
// spawn two enemy units
// spawn two friendly units
