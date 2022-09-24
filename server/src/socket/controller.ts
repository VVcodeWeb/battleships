import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import consola from "consola";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

import RoomManager from "../RoomsManager";
import { config } from "../config";
import Room from "../Room";

const rooms = new RoomManager();
const generateID = new ShortUniqueId({ length: 8 });

const app = () => {
  //TODO: replace before deploying
  const io = new Server({ cors: { origin: "*" } });
  try {
    const pubClient = createClient({
      url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
  } catch (error) {
    consola.warn(error);
  }
  consola.info("Socket initialized");
  io.use((socket, next) => {
    const userID = socket.handshake.auth.userID;
    if (userID) socket.data.userID = userID;
    next();
  });

  io.on("connection", async (socket) => {
    consola.info("New connection", {
      socket: socket.id,
      user: socket.data.userID,
    });
    const { userID, roomID, action } = socket.handshake.query as any;
    const room = new Room({ socket, io, roomID, userID, action });

    const initialized = await room.init();
    socket.on("room:new", () => {
      const newUid = generateID();

      console.log("new room");
      rooms.add(newUid);
      socket.emit("room:new:id", newUid);
    });

    socket.on("room:join", (roomID) => {
      const room = rooms.get(roomID);
      if (room) {
        try {
          room.joinRoom(socket);
          rooms.update(room.ID, room);
        } catch (e) {}
      } else {
        //TODO: handle non existing room
      }
    });

    socket.on("player:ready", (board) => {
      console.log("player ready");
      const room = rooms.findByPlayer(socket.id);
      if (room) {
        room.playerIsReady(socket.id, board);
        rooms.update(room.ID, room);
      } else console.error("cant find players room");
    });

    socket.on("player:move", (move) => {
      const room = rooms.findByPlayer(socket.id);
      if (room) {
        try {
          room.playerTakesTurn(socket.id, move.x, move.y);
          rooms.update(room.ID, room);
        } catch (e: any) {
          console.error(e?.message);
        }
      } else console.error("cant find players room");
    });
  });

  return io;
};

export default app;
