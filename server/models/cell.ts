import type { Grid } from "./grid.ts";
import {Player} from "./player.ts";

export class Cell {
    constructor({ x, y, ownerPlayerId }: {
        x?: number;
        y?: number;
        ownerPlayerId?: string | null;
    } = {}) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.ownerPlayerId = ownerPlayerId || this.ownerPlayerId;
    }
    x: number = 0;
    y: number = 0;
    ownerPlayerId: string | null = null;
    private unitId: string | null = null;
    terrain: string = "grass";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    isSpawnableBy: (player: Player) => boolean = (player: Player) => {
        if(this.unitId) {
            return false;
        }
        if(this.ownerPlayerId === player.id) {
            return true;
        }
        return false
    }; 
    isMovableTo: () => boolean = () => {
        if(this.unitId) {
            return false;
        }
        return true;
    }
    getCellsInRange: (range: number, grid: Grid) => Cell[] = (range: number, grid: Grid) => {
        const cellsInRange: Cell[] = [];
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                if (dx === 0 && dy === 0) continue; // Skip the current cell
                const neighborX = this.x + dx;
                const neighborY = this.y + dy;
                // Assuming there's a function to get a cell by its coordinates
                const neighborCell = grid.cellAt({x: neighborX, y: neighborY});
                if (neighborCell) {
                    cellsInRange.push(neighborCell);
                }
            }
        }
        return cellsInRange;
    }
    getEnemyUnitsInRange: (range: number, grid: Grid, player: Player) => Cell[] = (range: number, grid: Grid, player: Player) => {
        const cellsInRange = this.getCellsInRange(range, grid);
        return cellsInRange.filter(cell => cell.hasUnit && cell.ownerPlayerId !== player.id);
    }
}
