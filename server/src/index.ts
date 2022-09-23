import { Server } from "socket.io";
import ShortUniqueId from "short-unique-id";
import Room from "./Room";
import RoomManager from "./RoomsManager";
//TODO: replace before deployingw
export const io = new Server({ cors: { origin: "*" } });
const rooms = new RoomManager();

const generateID = new ShortUniqueId({ length: 8 });
io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (userID) socket.data.userID = userID;
  next();
});

io.on("connection", (socket) => {
  console.log({ socket: socket.id, user: socket.data.userID });
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

io.listen(8000);
