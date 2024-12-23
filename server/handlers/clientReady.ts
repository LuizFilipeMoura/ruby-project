import {globalGameState} from "../main.ts";

export const clientReady_loadGrid = (socket: any, data: any ) => {
    try {
        console.log("clientReady_loadGrid", data);
        console.log("globalGameState", globalGameState);
        socket.emit("serverReady_loadGrid", globalGameState.grid);
    } catch (error) {
        console.error(`Error handling event 'spawnUnit':`, error);
    }
}
