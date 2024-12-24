import {WithId} from "./withId.ts";

export class Player extends WithId{
    name: string = "";
    health: number = 100;
    gold: number = 0;
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    enemyId: string = "";
    yLine : number = 0;
    constructor({gold = 1000, name = ""}: {gold: number, name?: string}) {
        super();
        this.gold = gold;
        this.name = name;
    }
}
