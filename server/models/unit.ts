import type { Cell } from "./cell.ts";
import { WithId } from "./withId.ts";

export class Unit extends WithId {
    name: string = "";
    health: number = 100;
    attack: number = 10;
    defense: number = 10;

    // How many ticks does it take for the unit to advance one cell, lower is faster
    ticksToMoveOneCell: number = 50;
    range: number = 1;
    spawnCost: number = 0;
    description: string = "";
    imageUrl: string = "";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    positionCell: Cell | null = null;
    targetCell: Cell | null = null;
    isAttacking: boolean = false;

    canMove?: () => boolean = () => {
        if(this.isAttacking) {
            return false;
        }
        return true;
    };
}
