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
            unit.ticksUntilMove--;
            if (unit.ticksUntilMove <= 0) {
                unit.ticksUntilMove = unit.ticksNeededToMoveOneCell;
                if (unit.positionCell === null) {
                    continue;
                }
                if (unit.targetCell) {
                    const { nextCandidate: [x, y] } = moveUnit({
                        unit,
                        targetCell: unit.targetCell,
                        grid: this.grid,
                    });
                    unit.positionCell = this.grid.cellAt({ x, y });
                }
            }
        }
    }

    advanceTicks = (numberOfTicks: number) => {
        for (let i = 0; i < numberOfTicks; i++) {
            this.nextTick();
        }
    };
    getUnitById = (id: string) => {
        return this.units.find((unit) => unit.id === id);
    }
}
