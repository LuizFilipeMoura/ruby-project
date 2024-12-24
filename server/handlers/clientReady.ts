import {GameState} from "../models/gameState.ts";
import {Player} from "../models/player.ts";
import {Grid} from "../models/grid.ts";

const waitingPlayers: any[] = []; // Queue to hold waiting players
export const gameStates: any = {}; // Store game states for each room


export const clientReady_playerReady = (socket: any, data: any, io: any) => {
    try {
        // Handle player readiness
        socket.player = new Player({gold: 1000, name: socket.id});
        console.log(`Player ready: ${socket.player.id}`);
        waitingPlayers.push(socket);

        // Check if we can start a game
        if (waitingPlayers.length >= 2) {
            const player1Socket = waitingPlayers.shift();
            const player2Socket = waitingPlayers.shift();

            const player1 = player1Socket.player;
            player1Socket.emit("preGameStart:AssignPlayerId", {
                playerId: player1.id,
            });
            const player2 = player2Socket.player;
            player2Socket.emit("preGameStart:AssignPlayerId", {
                playerId: player2.id,
            });

            const roomId = `room-${player1.id}-${player2.id}`;
            player1Socket.join(roomId);
            player2Socket.join(roomId);

            console.log(`Game started in room: ${roomId}`);
            const gameState = new GameState();
            gameState.roomId = roomId;
            player1.enemyId = player2.id;
            player2.enemyId = player1.id;

            player1.yLine = 0;
            player2.yLine = -1;

            gameState.players = [player1, player2];
            gameState.grid = new Grid(10, 10);

            for(let i = 0; i < gameState.grid.numberOfColumns; i++) {
                for(const _player of [player1, player2]) {
                    let {yLine} = _player;
                    if(yLine < 0) {
                        yLine = gameState.grid.numberOfRows + yLine;
                    }
                    const cell = gameState.grid.cellAt({x: i, y: yLine});
                    if(!cell) {
                        throw new Error("Cell not found");
                    }
                    cell.ownerPlayerId = _player.id;
                }

            }


            gameStates[gameState.id] = gameState;
            player1Socket.gameStateId = gameState.id
            player2Socket.gameStateId = gameState.id

            io.to(roomId).emit("completeGameStateTick", gameState);
        }
    } catch (error) {
        console.error(`Error handling event 'spawnUnit':`, error);
    }
};

// export const clientReady_startGame = (socket: any, data: any, io: any) => {
//     try {
//         socket.join();
//
//         console.log("clientReady_startGame", data);
//         console.log("globalGameState", globalGameState);
//         socket.emit("serverReady_assignPlayer", globalGameState.grid);
//     } catch (error) {
//         console.error(`Error handling event 'spawnUnit':`, error);
//     }
// };
