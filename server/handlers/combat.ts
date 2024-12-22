import { GameState } from "../models/gameState.ts";
import type { Grid } from "../models/grid.ts";
import type { Player } from "../models/player.ts";
import { Unit } from "../models/unit.ts";

export interface VerifyCombatParams {
    mainUnit: Unit;
    grid: Grid;
    player: Player;
    gameState?: GameState;
}

const verfifyIfAnyUnitIsInRange = (
    { mainUnit, grid, player }: VerifyCombatParams,
) => {
    const unitsInRange = mainUnit.positionCell?.getEnemyUnitsInRange(
        mainUnit.range,
        grid,
        player,
    ) || [];
    console.log(unitsInRange);
    if (unitsInRange.length === 0) {
        throw new Error("No units in range");
    }
    return unitsInRange.map((cell) => cell.unitId);
};


export const verifyCombat = (
    { mainUnit, grid, player, gameState }: VerifyCombatParams,
) => {
    if (!gameState) {
        throw new Error("Game state is required");
    }
    if (!mainUnit.canAttack) {
        throw new Error("Unit cannot attack");
    }

    try {
        const enemyUnitsIdsInRange = verfifyIfAnyUnitIsInRange({
            mainUnit,
            grid,
            player,
        });
        console.log(enemyUnitsIdsInRange);

        if (
            !enemyUnitsIdsInRange || enemyUnitsIdsInRange.length === 0 ||
            !enemyUnitsIdsInRange[0]
        ) {
            throw new Error("No units in range");
        }

        if (!mainUnit.currentlyTargetedId) {
            mainUnit.currentlyTargetedId = enemyUnitsIdsInRange[0];
        }

        if (mainUnit.currentlyTargetedId === mainUnit.id) {
            throw new Error("Unit cannot target itself");
        }
        let targetUnit = gameState.getUnitById(mainUnit.currentlyTargetedId);

        if (mainUnit.currentlyTargetedId && !targetUnit) {
            throw new Error("Target unit not found, not attacking");
        }

        if (!targetUnit || !enemyUnitsIdsInRange.includes(targetUnit.id)) {
            mainUnit.currentlyTargetedId = enemyUnitsIdsInRange[0];
        }

        targetUnit = gameState.getUnitById(mainUnit.currentlyTargetedId) as Unit;

        mainUnit.attacks(targetUnit, gameState);

    } catch (error) {
        mainUnit.currentlyTargetedId = null;
        console.error(error);
        return;
    }
};
