import { serve } from "https://deno.land/std@0.220.1/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { GameState } from "./models/gameState.ts";
import { spawnUnitHandler } from "./handlers/spawnUnit.ts";
import {clientReady_loadGrid} from "./handlers/clientReady.ts";

const io = new Server({
  cors: {
    origin: "*",
  },
});
export const globalGameState = new GameState();

const handlers = {
  "spawnUnit": spawnUnitHandler,
  "clientReady_loadGrid": clientReady_loadGrid
}

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  Object.keys(handlers).forEach((eventName) => {
    socket.on(eventName, (data) => {
      try {
        // @ts-ignore
        handlers[eventName](socket, data);
      } catch (error) {
        console.error(`Error handling event '${eventName}':`, error);
      }
    });
  });
  socket.emit("hello", "world");

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

await serve(io.handler(), {
  port: 3000,
});
