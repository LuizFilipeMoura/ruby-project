import { expect } from "jsr:@std/expect";
import { spawnUnit } from "../handlers/spawnUnit.ts";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";
import { Grid } from "../models/grid.ts";
import { Cell } from "../models/cell.ts";
import { moveUnit } from "../handlers/moveUnit.ts";

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
    grid = new Grid(10, 10);
    cell = grid.cellAt({ x: 0, y: 0 }) || new Cell();
    unit = new Unit();
    unit = {
        ...unit,
        name: "Test Unit",
        spawnCost: 10,
    };
    cell.ownerPlayerId = player1.id;
}

Deno.test("spawn units correctly", () => {
    setup();
    cell = grid.cellAt({ x: 5, y: 0 }) || new Cell();
    expect(gameState.units.length).toBe(0);
    moveUnit({ unit, targetCell: cell });
});