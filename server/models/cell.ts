import type { Grid } from "./grid.ts";
import {Player} from "./player.ts";
import type { Unit } from "./unit.ts";

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
    unitId: string | null = null;
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
    getClosestMovableCell: (grid: Grid) => Cell | null = (grid: Grid) => {
        if(this.isMovableTo()) {
            return this;
        }
        const cellsInRange = this.getCellsInRange(1, grid);
        return cellsInRange.find(cell => cell.isMovableTo()) || null;
    } 
    
    isMovableTo: () => boolean = () => {
        if(this.unitId) {
            return false;
        }
        return true;
    }
    setUnit: (unit: Unit) => string = (unit: Unit) => {
        if(this.unitId) {
            throw new Error("Cell already has a unit");
        }
        unit.positionCell?.removeUnit();
        unit.positionCell = this;
        this.unitId = unit.id;
        return unit.id;
    }
    removeUnit: () => boolean = () => {
        if(!this.unitId) {
            throw new Error("Does not have a unit");
        }
        this.unitId = null;
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
        return cellsInRange.filter(cell => cell.unitId && cell.ownerPlayerId !== player.id);
    }
}
