import { expect } from "jsr:@std/expect";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";
import { Grid } from "../models/grid.ts";
import { Cell } from "../models/cell.ts";
import { moveUnit } from "../handlers/moveUnit.ts";
import { spawnUnit } from "../handlers/spawnUnit.ts";

let gameState: GameState;
let player1: Player;
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
    grid = new Grid(6, 4);
    cell = grid.cellAt({ x: 0, y: 0 }) || new Cell();
    unit = new Unit({
        name: "friendly unit",
        spawnCost: 10,
        positionCell: cell,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
    });

    gameState.grid = grid;
    cell.ownerPlayerId = player1.id;
    spawnUnit({ unit, gameState, player: player1, cell });
}

Deno.test("move the unit correctly once based on gameTicks", () => {
    setup();

    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit.targetCell = cell;
    expect(gameState.units.length).toBe(1);
    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(21);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);
});
Deno.test("move the unit multiple times", () => {
    setup();
    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit.targetCell = cell;
    expect(gameState.units.length).toBe(1);
    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(21);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(2);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(3);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(4);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(5);
    expect(unit.positionCell.y).toBe(0);
});

Deno.test("move the unit to avoid cells with hasUnit", () => {
    setup();
    const obstacleCell = grid.cellAt({ x: 2, y: 0 });
    if (obstacleCell === null) {
        throw new Error("Cell must exist");
    }
    obstacleCell.unitId = "obstacle";
    gameState.grid = grid;
    const matrix = grid.getValidGridAsMatrix();
    console.log("matrix", matrix);

    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();

    unit.targetCell = cell;
    expect(gameState.units.length).toBe(1);
    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(21);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(2);
    expect(unit.positionCell.y).toBe(1);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(3);
    expect(unit.positionCell.y).toBe(1);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(4);
    expect(unit.positionCell.y).toBe(1);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(5);
    expect(unit.positionCell.y).toBe(0);
});

Deno.test("don't move until enough ticks have passed", () => {
    setup();
    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit.targetCell = cell;
    console.log("unit.positionCell", unit.positionCell);
    expect(gameState.units.length).toBe(1);
    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(19);
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(1);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);
});

Deno.test("unit cannot move if it has no movement capability", () => {
    setup();
    Object.defineProperty(unit, "canMove", {
        get: () => false,
    });
    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit.targetCell = cell;

    expect(() => gameState.advanceTicks(21)).toThrow("Unit cannot move");
});

Deno.test("unit cannot move if already in target cell", () => {
    setup();
    cell = grid.cellAt({ x: 0, y: 0 }) || new Cell();
    unit.targetCell = cell;

    expect(() => gameState.advanceTicks(21)).toThrow(
        "Unit is already in target cell",
    );
});

Deno.test("assess if the matrix is updated after the unit leaves the cell", () => {
    setup();
    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit.targetCell = cell;

    expect(gameState.units.length).toBe(1);
    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    expect(unit.positionCell.x).toBe(0);
    expect(unit.positionCell.y).toBe(0);

    gameState.advanceTicks(21);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);

    const matrix = grid.getValidGridAsMatrix();
    console.log("matrix", matrix);
    expect(matrix[0][0]).toBe(0); // The cell at (0, 0) should be empty
    expect(matrix[0][1]).toBe(1); // The cell at (1, 0) should have the unit
});

Deno.test("create two units moving against each other, they avoid each other", () => {
    setup();
    const enemyCell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    const player2 = new Player();
    player2.gold = 1000;
    enemyCell.ownerPlayerId = player2.id;

    const unit2 = new Unit({
        name: "enemy unit",
        spawnCost: 10,
        positionCell: enemyCell,
        ticksNeededToMoveOneCell: 20,
        ticksUntilMove: 20,
    });
    spawnUnit({ unit: unit2, gameState, player: player2, cell: enemyCell });

    unit.targetCell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    unit2.targetCell = grid.cellAt({ x: 0, y: 0 }) || new Cell();

    if (unit.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    if (unit2.positionCell === null) {
        throw new Error("Unit must have a position cell");
    }
    gameState.advanceTicks(21);
    expect(unit.positionCell.x).toBe(1);
    expect(unit.positionCell.y).toBe(0);
    expect(unit2.positionCell.x).toBe(4);
    expect(unit2.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(2);
    expect(unit.positionCell.y).toBe(0);
    expect(unit2.positionCell.x).toBe(3);
    expect(unit2.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(3);
    expect(unit.positionCell.y).toBe(1);
    expect(unit2.positionCell.x).toBe(2);
    expect(unit2.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(4);
    expect(unit.positionCell.y).toBe(1);
    expect(unit2.positionCell.x).toBe(1);
    expect(unit2.positionCell.y).toBe(0);

    gameState.advanceTicks(20);
    expect(unit.positionCell.x).toBe(5);
    expect(unit.positionCell.y).toBe(0);
    expect(unit2.positionCell.x).toBe(0);
    expect(unit2.positionCell.y).toBe(0);
});