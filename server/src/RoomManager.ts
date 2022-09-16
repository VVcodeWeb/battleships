import Room, { IOtype } from "./Room";

export default class RoomManager {
  rooms: Room[] = [];

  getRoom = (roomID: string) => this.rooms.find((room) => room.ID === roomID);
  updateRoom = (roomID: string, room: Room) => {
    this.rooms = this.rooms.map((r) => {
      if (r.ID === roomID) return room;
      return r;
    });
  };

  addRoom = (room: Room) => this.rooms.push(room);
  deleteRoom = (roomID: string) =>
    (this.rooms = this.rooms.filter((room) => room.ID !== roomID));

  findRoomByPlayer = (socketID: string) => {
    return this.rooms.find(
      ({ player1, player2 }) =>
        player1?.ID === socketID || player2?.ID === socketID
    );
  };
}
