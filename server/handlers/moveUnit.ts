import { Cell } from "../models/cell.ts";
import PF from "npm:pathfinding@0.4.18";

import type { Unit } from "../models/unit.ts";

interface MoveUnitParams {
    unit: Unit;
    targetCell: Cell;
}
export const moveUnit = ({ unit, targetCell }: MoveUnitParams) => {
    const matrix = [
        [0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0],
    ];
    const grid = new PF.Grid(matrix);
    const finder = new PF.AStarFinder({
        allowDiagonal: true
    });
    const path = finder.findPath(1, 2, 4, 2, grid);
    console.log("path", path);
    if (!unit.canMove|| !unit.canMove()) {
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

    



    

    

}