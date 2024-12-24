import {WithId} from "./withId.ts";

export class Player extends WithId{
    name: string = "";
    health: number = 100;
    gold: number = 0;
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
    constructor({gold, name}: {gold?: number, name?: string}) {
    //     this.id = crypto.randomUUID();
        super();
        this.gold = gold;
        this.name = name;
    }
}
