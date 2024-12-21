import { WithId } from "./withId.ts";

export class Unit extends WithId {
    name: string = "";
    health: number = 100;
    attack: number = 10;
    defense: number = 10;
    speed: number = 5;
    range: number = 1;
    spawnCost: number = 0;
    description: string = "";
    imageUrl: string = "";
    createdAt: number = Date.now();
    updatedAt: number = Date.now();
}
