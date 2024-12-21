import type { Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import type { GameState } from "../models/gameState.ts";
import type { Player } from "../models/player.ts";
import type { Unit } from "../models/unit.ts";
import {Cell} from "../models/cell.ts";

interface SpawnUnitProps {
    unit: Unit;
    gameState: GameState;
    player: Player;
    cell: Cell;
}
export const spawnUnitHandler = (socket: any, data: any ) => {
    try {
        spawnUnit(data);
    } catch (error) {
        console.error(`Error handling event 'spawnUnit':`, error);
    }
}
export const spawnUnit = ({unit, gameState, player, cell}: SpawnUnitProps) => {

    if(!cell) {
        throw new Error("Cell must be provided");
    }
    if(!cell.isSpawnableBy(player)) {
        throw new Error("Cell is not spawnable by player");
    }
    if(!player) {
        throw new Error("Player must be provided");
    }
    if(!gameState) {
        throw new Error("GameState must be provided");
    }
    if(!unit) {
        throw new Error("Unit must be provided");
    }
    if (!unit.name) {
        throw new Error("Unit must have a name");
    }
    if(player.gold < unit.spawnCost) {
        throw new Error("Player does not have enough gold to spawn unit");
    }
    player.gold -= unit.spawnCost;
    cell.hasUnit = true;
    gameState.units.push(unit);
    // io.emit("unitSpawned", unit);

}
