export class Player {
    id: string;
    name: string = "";
    health: number = 100;
    gold: number = 0;
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    constructor() {
        this.id = crypto.randomUUID();
    }
}