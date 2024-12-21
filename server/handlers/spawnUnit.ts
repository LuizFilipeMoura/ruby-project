import type { Socket } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import type { GameState } from "../models/gameState.ts";
import type { Player } from "../models/player.ts";
import type { Unit } from "../models/unit.ts";

interface SpawnUnitProps {
    unit: Unit;
    gameState: GameState;
    player: Player;
}
export const spawnUnitHandler = (socket, data ) => {
    try {
        spawnUnit(data);
    } catch (error) {
        console.error(`Error handling event 'spawnUnit':`, error);
    }
}
export const spawnUnit = ({unit, gameState, player}: SpawnUnitProps) => {
    
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

    console.log(`Spawning unit: ${unit.name}`);
    gameState.units.push(unit);
    player.gold -= unit.spawnCost;
    // io.emit("unitSpawned", unit);

}