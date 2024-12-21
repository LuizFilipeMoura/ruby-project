import { Cell } from "../models/cell.ts";
import PF from "npm:pathfinding@0.4.18";

import type { Unit } from "../models/unit.ts";
import { Grid } from "../models/grid.ts";

interface MoveUnitParams {
    unit: Unit;
    targetCell: Cell;
    grid: Grid;
}
export interface MoveUnitResponse {
    nextCandidate: number[];
    fullPath: number[][];
}

export const moveUnit = ({ unit, targetCell, grid }: MoveUnitParams): MoveUnitResponse => {

    if (!unit.canMove) {
        throw new Error("Unit cannot move");
    }
    if (!unit.positionCell) {
        throw new Error("Unit must have a position cell");
    }
    if (!targetCell) {
        throw new Error("Target cell must be provided");
    }
    if (unit.positionCell === targetCell) {
        throw new Error("Unit is already in target cell");
    }

    const matrix = grid.getValidGridAsMatrix();
    const preparedGrid = new PF.Grid(matrix);
    const finder = new PF.AStarFinder({
        allowDiagonal: true
    });
    const path = finder.findPath(unit.positionCell.x, unit.positionCell.y, targetCell.x, targetCell.y, preparedGrid);

//during the movement, the cells are been updated?

    return {
        nextCandidate: path[1],
        fullPath: path
    }

    

    

}