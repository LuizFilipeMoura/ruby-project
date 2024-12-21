import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { spawnUnit } from "../handlers/spawnUnit.ts";
import { Unit } from "../models/unit.ts";
import { GameState } from "../models/gameState.ts";
import { Player } from "../models/player.ts";

let gameState = new GameState();
let player1 = new Player();
player1 = {
  ...player1,
  gold: 1000,
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
    expect(gameState.units.length).toBe(0);
    spawnUnit({ unit, gameState, player: player1 });
    expect(gameState.units.length).toBe(1);
    expect(gameState.units.length).toBe(1);
  });

  it("throws an error if no unit is provided", () => {
    //@ts-ignore
    expect(() => spawnUnit({ unit: null, gameState, player: player1 })).toThrow(
      "Unit must be provided",
    );
  });

  it("throws an error if no gameState is provided", () => {
    expect(() =>
      //@ts-ignore
      spawnUnit({ unit: new Unit(), gameState: null, player: player1 })
    ).toThrow("GameState must be provided");
  });

  it("throws an error if the unit has no name", () => {
    const unit = new Unit();
    //@ts-ignore
    expect(() => spawnUnit({ unit, gameState, player: player1 })).toThrow(
      "Unit must have a name",
    );
  });
  it("throws an error if the player does not have enough gold", () => {
    let unit = new Unit();
    unit = {
      ...unit,
      name: "Test Unit",
      spawnCost: 1000,
    };
    expect(() => spawnUnit({ unit, gameState, player: player1 })).toThrow(
      "Player does not have enough gold to spawn unit",
    );
  });
  it("throws an error if no player is provided", () => {
    //@ts-ignore
    expect(() => spawnUnit({ unit: new Unit(), gameState, player: null })).toThrow(
      "Player must be provided",
    );
  });
});
