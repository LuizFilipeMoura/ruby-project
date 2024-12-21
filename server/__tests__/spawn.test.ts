import { expect } from "jsr:@std/expect";
import { spawnUnit } from "../handlers/spawnUnit.ts";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";
import { Grid } from "../models/grid.ts";
import { Cell } from "../models/cell.ts";

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
    expect(gameState.units.length).toBe(0);
    spawnUnit({ unit, gameState, player: player1, cell });
    expect(gameState.units.length).toBe(1);
});

Deno.test("can't spawn twice in the same cell", () => {
    setup();
    expect(gameState.units.length).toBe(0);
    spawnUnit({ unit, gameState, player: player1, cell });
    expect(gameState.units.length).toBe(1);
    expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
        .toThrow(
            "Cell is not spawnable by player",
        );
});

Deno.test("can't spawn on cells that are not the players", () => {
    setup();
    cell = new Cell({ ownerPlayerId: "not the player" });
    expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
        .toThrow(
            "Cell is not spawnable by player",
        );
});

Deno.test("throws an error if the unit has no name", () => {
    setup();
    unit = new Unit();
    // @ts-ignore
    expect(() => spawnUnit({ unit, gameState, player: player1, cell })).toThrow(
        "Unit must have a name",
    );
});

Deno.test("throws an error if the player does not have enough gold", () => {
    setup();
    unit = {
        ...unit,
        name: "Test Unit",
        spawnCost: 1001,
    };
    expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
        .toThrow(
            "Player does not have enough gold to spawn unit",
        );
});
