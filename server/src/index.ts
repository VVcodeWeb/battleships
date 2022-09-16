import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import Room from "./Room";
import RoomManager from "./RoomManager";

export const io = new Server({ cors: { origin: "*" } });
const uid = new ShortUniqueId({ length: 8 });

const rooms = new RoomManager();
io.on("connection", (socket) => {
  console.log({ socket: socket.id });
  socket.on("newRoom", () => {
    const newUid = uid();
    const room = new Room(newUid);
    rooms.addRoom(room);
    socket.emit("newRoomID", newUid);
  });

  socket.on("joinRoom", (roomID) => {
    const room = rooms.getRoom(roomID);
    if (room) {
      try {
        room.joinRoom(socket);
        rooms.updateRoom(room.ID, room);
        console.log({ roomID });
      } catch (e) {
        console.log(e);
      }
    } else {
      //handle non existing room
    }
  });

  socket.on("playerReady", (board) => {
    const room = rooms.findRoomByPlayer(socket.id);
    if (room) {
      room.playerIsReady(socket.id, board);
      rooms.updateRoom(room.ID, room);
    } else console.error("cant find players room");
  });
});

io.listen(8000);
