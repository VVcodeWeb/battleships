import { Server } from "socket.io";
import consola from "consola";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../../shared/types";
import Room from "../models/Room";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { config } from "../config";

const app = () => {
  //TODO: replace before deploying
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    any
  >({
    cors: { origin: "*" },
  });
  const multiPlayer = io.of("/");
  consola.info("Socket initialized");
  multiPlayer.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    consola.info(`User with id ${userId}`);
    if (userId) socket.data.userId = userId;
    next();
  });

  multiPlayer.on("connection", async (socket) => {
    consola.info("New connection", {
      socket: socket.id,
      user: socket.data.userId,
    });

    consola.info("Number of connections " + io.engine.clientsCount);
    socket.on("disconnect", () => {
      config.debug &&
        consola.info("Disconnect", {
          socket: socket.id,
          user: socket.data.userId,
        });
    });

    socket.on("room:join", async (roomID, callback) => {
      config.debug && consola.info("room join event");
      const room = await Room.find(roomID);
      if (!room) {
        return callback({
          status: "error",
          error: "invlaid room id",
        });
      }
      config.debug && room.print("Found room: ");
      await room.playerJoin(socket);
    });

    socket.on("player:ready", async (roomID, ships, callback) => {
      config.debug &&
        consola.info(
          `Player ${socket.data.userId} is ready in the room ${roomID}`
        );
      const room = await Room.find(roomID);
      if (!room) {
        return callback({
          status: "error",
          error: "invlaid room id",
        });
      }
      await room.playerReady(socket, ships);
    });
    socket.on("player:move", async (roomID, { x, y }, callback) => {
      config.debug &&
        consola.info(`Player ${socket.data.userId} makes move x ${x}: y ${y}`);
      const room = await Room.find(roomID);
      if (!room) {
        return callback({
          status: "error",
          error: "invlaid room id",
        });
      }
      await room.playerMoves(socket, { x, y });
    });
  });

  return io;
};

export default app;
