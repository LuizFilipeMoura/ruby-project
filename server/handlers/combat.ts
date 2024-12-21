import type { Grid } from "../models/grid.ts";
import type { Player } from "../models/player.ts";
import { Unit } from "../models/unit.ts";

export interface VerifyCombatParams {
    mainUnit: Unit;
    grid: Grid; 
    player: Player;
}

const verfifyIfAnyUnitIsInRange = ({mainUnit, grid, player}: VerifyCombatParams) => {
    const unitsInRange = mainUnit.positionCell?.getEnemyUnitsInRange(mainUnit.range, grid, player) || [];
    console.log("17 - ", unitsInRange);
    if (unitsInRange.length === 0) {
        throw new Error("No units in range");
    }
}

export const verifyCombat = ({mainUnit, grid, player }: VerifyCombatParams) => {
    console.log("20 - ", mainUnit.canAttack);

    const unit = new Unit();
    console.log(unit.canAttack); // Correct way to access the getter

    if (!mainUnit.canAttack) {
        throw new Error("Unit cannot attack");
    }
    verfifyIfAnyUnitIsInRange({mainUnit, grid, player});

    



};