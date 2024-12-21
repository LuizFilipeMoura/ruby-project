import {Player} from "./player.ts";

export class Cell {
    constructor({ x, y, hasUnit, ownerPlayerId }: {
        x?: number;
        y?: number;
        hasUnit?: boolean;
        ownerPlayerId?: string | null;
    } = {}) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.hasUnit = hasUnit || this.hasUnit;
        this.ownerPlayerId = ownerPlayerId || this.ownerPlayerId;
    }
    x: number = 0;
    y: number = 0;
    hasUnit: boolean = false;
    ownerPlayerId: string | null = null;
    unitId: string | null = null;
    terrain: string = "grass";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    isSpawnableBy: (player: Player) => boolean = (player: Player) => {
        if(this.hasUnit) {
            return false;
        }
        if(this.ownerPlayerId === player.id) {
            return true;
        }
        return false
    }; 
    isMovableTo: () => boolean = () => {
        if(this.hasUnit) {
            return false;
        }
        return true;
    }
}
