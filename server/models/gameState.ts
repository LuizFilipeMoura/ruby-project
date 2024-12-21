import {Unit} from "./unit.ts";
import {Player} from "./player.ts";
import {Cell} from "./cell.ts";
import {Grid} from "./grid.ts";

export class GameState {
    units: Unit[] = [];
    players: Player[] = [];
    currentTick: number = 0;
    grid: Grid = new Grid(10, 10);

}
