import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import Room from "./Room";
import RoomManager from "./RoomManager";

export const io = new Server({ cors: { origin: "*" } });
const uid = new ShortUniqueId({ length: 8 });

const rooms = new RoomManager();
io.on("connection", (socket) => {
  console.log({ socket: socket.id });
  socket.on("room:new", () => {
    const newUid = uid();
    const room = new Room(newUid);
    rooms.addRoom(room);
    socket.emit("room:new:id", newUid);
  });

  socket.on("room:join", (roomID) => {
    const room = rooms.getRoom(roomID);
    if (room) {
      try {
        room.joinRoom(socket);
        rooms.updateRoom(room.ID, room);
        console.log({ roomID });
      } catch (e) {}
    } else {
      //handle non existing room
    }
  });

  socket.on("player:ready", (board) => {
    console.log("player ready");
    const room = rooms.findRoomByPlayer(socket.id);
    if (room) {
      room.playerIsReady(socket.id, board);
      rooms.updateRoom(room.ID, room);
    } else console.error("cant find players room");
  });

  socket.on("player:move", (move) => {
    const room = rooms.findRoomByPlayer(socket.id);
    if (room) {
      try {
        room.playerTakesTurn(socket.id, move.x, move.y);
        rooms.updateRoom(room.ID, room);
      } catch (e: any) {
        console.error(e?.message);
      }
    } else console.error("cant find players room");
  });
});

io.listen(8000);
