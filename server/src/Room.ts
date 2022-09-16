import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from ".";

type LogEntry = {
  player: string;
  x: number;
  y: number;
  success: boolean;
};
const LOBBY = "lobby";
const PLANNING = "planning";
const FIGHTING = "figthing";
type GameStage = typeof LOBBY | typeof PLANNING | typeof FIGHTING;
export type IOtype = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

type gfg = {
  ID: string;
  ships: any[];
  status: "";
};

class Player {
  private _ID: string;
  private _status: GameStage | "ready";
  private _board: any[];
  constructor(ID: string) {
    this._ID = ID;
    this._status = LOBBY;
    this._board = [];
  }

  get ID() {
    return this._ID;
  }
  set status(value: GameStage | "ready") {
    this._status = value;
  }
  get status() {
    return this._status;
  }

  set board(ships: any[]) {
    this._board = ships;
  }
  get board() {
    return this._board;
  }
}
export default class Room {
  _ID: string;
  player1: Player | null;
  player2: Player | null;
  gameLog: LogEntry[] = [];
  _stage: GameStage;

  constructor(id: string) {
    this._ID = id;
    this._stage = LOBBY;
    this.player1 = null;
    this.player2 = null;
  }
  private isRoomFull = () => Boolean(this.player1) && Boolean(this.player2);
  private getPlayer = (ID: string) => {
    if (this.player1?.ID === ID) return this.player1;
    if (this.player2?.ID === ID) return this.player2;
    console.error("cant find player in the room player");
    return null;
  };

  joinRoom = (socket: Socket) => {
    if (this.isRoomFull()) throw new Error("FULL ROOM");
    if (this.getPlayer(socket.id)) throw new Error("ALREADY IN THE ROOM");
    socket.join(this.ID);
    if (!this.player1) this.player1 = new Player(socket.id);
    else if (!this.player2) this.player2 = new Player(socket.id);

    console.log("user " + socket.id + "joined room " + this.ID);
    io.to(this.ID).emit("hi", [this.player1?.ID, this.player2?.ID]);
    if (this.isRoomFull()) {
      console.log("Room is full");
      this.stage = PLANNING;
      io.to(this.ID).emit("stage", PLANNING);
    }
  };

  playerIsReady = (socketID: string, board: any[]) => {
    if (this.stage === PLANNING) {
      const { player1, player2 } = this;
      if (player1?.ID === socketID) {
        player1.status = "ready";
        player1.board = board;
      }
      if (player2?.ID === socketID) {
        player2.status = "ready";
        player2.board = board;
      }
      if (player1?.status === "ready" && player2?.status === "ready") {
        this.stage = FIGHTING;
        io.to(this.ID).emit("game/stage", this.stage);
      }
    }
  };

  set stage(value: GameStage) {
    this._stage = value;
  }
  get stage() {
    return this._stage;
  }
  get ID() {
    return this._ID;
  }
}
