import Room from "../Room";
import _ from "underscore";
import fs from "fs";
import { RoomType } from "../types";

/**
 * A local JSON database.
 */
export default class RoomManager {
  rooms: Room[] = [];
  //TODO: replace before deploy
  _path: any = "./src/RoomsManager/rooms.json";

  constructor() {
    this.rooms = new Array();
    this.init();
  }
  get path() {
    return this._path;
  }
  init() {
    if (!fs.existsSync(this.path)) {
      fs.appendFileSync(this.path, "[]");
    }
    const roomsArray = JSON.parse(fs.readFileSync(this.path).toString());
    roomsArray.forEach((room: RoomType) => {
      this.rooms.push(new Room(room));
    });
  }

  findByPlayer(playerID: string) {
    const room = _.find(this.rooms, (room) => {
      return room.player1?.ID === playerID || room.player2?.ID === playerID;
    });

    return room;
  }

  update(roomID: string, room: Room) {
    const index = this.rooms.findIndex((room) => room.ID === roomID);
    if (index === -1) throw new Error(`Invalid room id ${roomID}`);
    this.rooms[index] = room;
    this.save();
  }
  get(roomID: string) {
    return _.findWhere(this.rooms, { ID: roomID });
  }
  add(uid: string) {
    const room = new Room({
      ID: uid,
      player1: null,
      player2: null,
      gameLog: [],
      stage: "lobby",
    });
    this.rooms.push(room);
    this.save();
  }

  save() {
    fs.writeFileSync(this.path, JSON.stringify(this.rooms));
  }
}
