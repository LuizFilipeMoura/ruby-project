import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { spawnUnit } from "../handlers/spawnUnit.ts";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";
import { Grid } from "../models/grid.ts";
import { Cell } from "../models/cell.ts";

let gameState = new GameState();
let player1 = new Player();
player1 = {
    ...player1,
    gold: 1000,
};
let grid = new Grid(10, 10);
let cell = grid.cellAt({ x: 0, y: 0 }) || new Cell();
let unit = new Unit();
unit = {
    ...unit,
    name: "Test Unit",
    spawnCost: 10,
};

describe("spawn", () => {
    it("spawn units correctly", () => {
        let unit = new Unit();
        unit = {
            ...unit,
            name: "Test Unit",
            spawnCost: 10,
        };
        player1 = new Player();
        player1 = {
            ...player1,
            gold: 100,
        };
        cell.ownerPlayerId = player1.id;
        expect(gameState.units.length).toBe(0);
        spawnUnit({ unit, gameState, player: player1, cell });
        expect(gameState.units.length).toBe(1);
    });
    it("can't spawn twice in the same cell", () => {
        cell.ownerPlayerId = player1.id;
        expect(gameState.units.length).toBe(1);
        expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
            .toThrow(
                "Cell is not spawnable by player",
            );
    });
    it("can't spawn on cells that are not the players", () => {
        cell = new Cell({ ownerPlayerId: "not the player" });
        expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
            .toThrow(
                "Cell is not spawnable by player",
            );
    });

    it("throws an error if the unit has no name", () => {
        unit = new Unit();
        // @ts-ignore
        expect(() => spawnUnit({ unit, gameState, player: player1 })).toThrow(
            "Unit must have a name",
        );
    });
    it("throws an error if no unit is provided", () => {
        expect(() =>
            spawnUnit({ unit: new Unit(), gameState, player: player1, cell })
        ).toThrow(
            "Unit must be provided",
        );
    });

    it("throws an error if no gameState is provided", () => {
        expect(() =>
            spawnUnit({
                unit: new Unit(),
                gameState: new GameState(),
                player: player1,
                cell,
            })
        ).toThrow("GameState must be provided");
    });
    it("throws an error if the player does not have enough gold", () => {
        unit = {
            ...unit,
            name: "Test Unit",
            spawnCost: 1000,
        };
        expect(() => spawnUnit({ unit, gameState, player: player1, cell }))
            .toThrow(
                "Player does not have enough gold to spawn unit",
            );
    });
});
