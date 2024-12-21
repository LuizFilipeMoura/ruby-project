export class Cell {
    x: number = 0;
    y: number = 0;
    isSpawnable: boolean = false;
    playerId: string | null = null;
    unitId: string | null = null;
    terrain: string = "grass";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
}
