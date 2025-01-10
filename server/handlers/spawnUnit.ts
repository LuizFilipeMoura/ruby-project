import type {GameState} from "../models/gameState.ts";
import type {Player} from "../models/player.ts";
import {Unit} from "../models/unit.ts";
import {Cell} from "../models/cell.ts";
import {gameStates} from "./clientReady.ts";
import { Grid } from "../models/grid.ts";

interface SpawnUnitProps {
    unit: Unit;
    gameState: GameState;
    player: Player;
    cell: Cell;
}
export const spawnUnitHandler = (socket: any, data: any) => {
    try {
        const { x, y } = data;
        const unit = new Unit({ name: "unit1", spawnCost: 10 });
        const gameState = gameStates[socket.gameStateId] as GameState;
        const player = gameState.getPlayerById(socket.player.id);
        if (!player) {
            throw new Error("Player not found");
        }
        if (!gameState) {
            throw new Error("Game state not found");
        }
        console.log("gameStategrid", gameState.grid);

        const cell = gameState.grid.cellAt({ x, y });
        if (!cell) {
            throw new Error("Cell not found");
        }
        spawnUnit({ unit, gameState, player, cell });
        console.log("spawnUnitHandler", data);
        console.log("gameStateId", socket.gameStateId);

        // socket.send("unitSpawned", {test: "abv"});
    } catch (error) {
        console.error(`Error handling event 'spawnUnit':`, error);
    }
};
export const spawnUnit = (
    { unit, gameState, player, cell }: SpawnUnitProps,
) => {
    if (!cell) {
        throw new Error("Cell must be provided");
    }
    if (!cell.isSpawnableBy(player)) {
        throw new Error("Cell is not spawnable by player");
    }
    if (!player) {
        throw new Error("Player must be provided");
    }
    if (!gameState) {
        throw new Error("GameState must be provided");
    }
    if (!unit) {
        throw new Error("Unit must be provided");
    }
    if (!unit.name) {
        throw new Error("Unit must have a name");
    }

    if (player.gold < unit.spawnCost) {
        throw new Error("Player does not have enough gold to spawn unit");
    }
    player.gold -= unit.spawnCost;
    cell.unitId = unit.id;
    unit.positionCell = cell;
    unit.targetCell = autoAssignTargetCell({ unit, gameState, player });
    console.log("unit", unit.targetCell?.x, unit.targetCell?.y);

    gameState.units.push(unit);
    return unit;
    // io.emit("unitSpawned", unit);
};
const autoAssignTargetCell = ({ unit, gameState, player }: Partial<SpawnUnitProps>) => {
    if (!unit) {
        throw new Error("Unit must be provided");
    }
    if (!gameState) {
        throw new Error("GameState must be provided");
    }
    if (!player) {
        throw new Error("Player must be provided");
    }
    if(!unit.positionCell) {
        throw new Error("Unit must have a position cell");
    }
    const enemyPlayer = gameState.getPlayerById(player.enemyId);
    if(!enemyPlayer) {
        return gameState.grid.cellAt({ x: unit.positionCell.x, y: gameState.grid.numberOfRows - 1 });
    }
    let { yLine } = enemyPlayer as Player;
    if (yLine < 0) {
        yLine = gameState.grid.numberOfRows + yLine;
    }
    return gameState.grid.cellAt({ x: unit.positionCell.x, y: yLine });
}