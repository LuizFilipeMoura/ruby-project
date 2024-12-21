import type { Cell } from "./cell.ts";
import { WithId } from "./withId.ts";

export class Unit extends WithId {
    constructor(props: Partial<Unit> = {}) {
        super();
        Object.assign(this, props);
    }
    name: string = "";
    health: number = 100;

    attackDamage: number = 10;
    defense: number = 10;

    // How many ticks does it take for the unit to advance one cell, lower is faster
    ticksNeededToMoveOneCell: number = 50;

    ticksNeededToAttack: number = 50;
    range: number = 1;
    spawnCost: number = 0;
    description: string = "";
    imageUrl: string = "";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    positionCell: Cell | null = null;
    targetCell: Cell | null = null;

    ownerPlayerId: string = "";
    ticksUntilMove: number = this.ticksNeededToMoveOneCell;

    ticksUntilAttack: number = this.ticksNeededToAttack;
    public get canMove() {
        if (this.currentlyTargetedId) {
            return false;
        }
        return true;
    }

    public get canAttack() {
        if (this.ticksUntilAttack > 0) {
            return false;
        }
        return true;
    }
    currentlyTargetedId: string | null = null;
}
