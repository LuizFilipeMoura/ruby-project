import {Cell} from "./cell.ts";

export class Grid {
    cells: Cell[] = [];
    numberOfColumns: number;
    numberOfRows: number;
    
    constructor(numberOfColumns: number, numberOfRows: number) {
        this.cells = [];
        this.numberOfColumns = numberOfColumns;
        this.numberOfRows = numberOfRows;
        for (let x = 0; x < this.numberOfColumns; x++) {
            for (let y = 0; y < this.numberOfRows; y++) {
                const cell = new Cell();
                cell.x = x;
                cell.y = y;
                this.cells.push(cell);
            }
        }
    }

    cellAt({ x, y }: { x: number; y: number }): Cell | null {
        return this.cells.find((cell) => cell.x === x && cell.y === y) || null;
    }
}
