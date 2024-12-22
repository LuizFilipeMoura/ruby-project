import { Unit } from "./unit.ts";
import { Player } from "./player.ts";
import { Cell } from "./cell.ts";
import { Grid } from "./grid.ts";
import { moveUnit } from "../handlers/moveUnit.ts";

export class GameState {
    units: Unit[] = [];
    players: Player[] = [];
    currentTick: number = 0;
    grid: Grid = new Grid(10, 10);

    nextTick() {
        this.currentTick++;
        for (let i = 0; i < this.units.length; i++) {

            const unit = this.units[i];
            const player = this.getPlayerById(unit.ownerPlayerId) as Player;
            unit.handleTickPassed({grid: this.grid, player, gameState: this});
        }
    }

    advanceTicks = (numberOfTicks: number) => {
        for (let i = 0; i < numberOfTicks; i++) {
            this.nextTick();
        }
    };
    getPlayerById = (id: string) => {
        return this.players.find((player) => player.id === id);
    }
    getUnitById = (id: string) => {
        return this.units.find((unit) => unit.id === id);
    }
    unitDies = (unit: Unit) => {
        unit.positionCell?.removeUnit();
        this.units = this.units.filter((u) => u.id !== unit.id);
    }
}
