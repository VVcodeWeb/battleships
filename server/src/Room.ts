import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from ".";
import { areXYsEual } from "./utils";

type LogEntry = {
  player: string;
  x: number;
  y: number;
  success: boolean;
  destroyed: any[] | null;
  timestamp: number;
};
const LOBBY = "lobby";
const PLANNING = "planning";
const FIGHTING = "figthing";
type GameStage = typeof LOBBY | typeof PLANNING | typeof FIGHTING;

const MAX_SHIP_PARTS = 18;

export type IOtype = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

class Player {
  private _ID: string;
  private _status: GameStage | "ready";
  private _ships: any[];
  constructor(ID: string) {
    this._ID = ID;
    this._status = LOBBY;
    this._ships = [];
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

  set ships(ships: any[]) {
    this._ships = ships;
  }
  get ships() {
    return this._ships;
  }
}
export default class Room {
  _ID: string;
  player1: Player | null;
  player2: Player | null;
  _stage: GameStage;
  private _gameLog: LogEntry[] = [];

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
    io.to(this.ID).emit("hi", [this.player1?.ID, this.player2?.ID]);
    if (this.isRoomFull()) {
      this.stage = PLANNING;
      io.to(this.ID).emit("game:stage:planning");
    }
  };

  playerIsReady = (socketID: string, ships: any[]) => {
    if (this.stage === PLANNING) {
      const { player1, player2 } = this;
      if (player1?.ID === socketID) {
        player1.status = "ready";
        player1.ships = ships;
      }
      if (player2?.ID === socketID) {
        player2.status = "ready";
        player2.ships = ships;
      }
      if (player1?.status === "ready" && player2?.status === "ready") {
        this.stage = FIGHTING;
        console.log("set figthing");
        io.to(this.ID).emit("game:stage:fighting", player1.ID);
      }
    }
  };

  playerTakesTurn = (socketID: string, x: number, y: number) => {
    const currentPlayer = this.getCurrentPlayer();
    if (socketID !== currentPlayer)
      throw new Error(`Its not ${socketID} turn!`);
    if (!this.player1?.ships || !this.player2?.ships)
      throw new Error(`Room is not full`);

    const allShipsTilesToCheck =
      currentPlayer === this.player1?.ID
        ? this.player2.ships
        : this.player1.ships;
    const shipShelled = allShipsTilesToCheck.find(
      (ship) => ship.x === x && ship.y === y
    );
    let isShipDestroyed = false;
    let allShipTiles: any[] = [];
    if (shipShelled) {
      allShipTiles = allShipsTilesToCheck.filter(
        (ship) => ship.name === shipShelled.name
      );
      isShipDestroyed = allShipTiles.every((shipTile) => {
        //current hit
        if (areXYsEual(shipTile.x, shipTile.y, x, y)) return true;
        //previous hits
        for (let log of this.gameLog.filter(
          (l) => l.player === currentPlayer
        )) {
          if (areXYsEual(shipTile.x, shipTile.y, log.x, log.y)) return true;
        }
        return false;
      });
    }
    const timestamp = Date.now();
    this.gameLog.push({
      player: currentPlayer,
      x,
      y,
      success: Boolean(shipShelled),
      destroyed: shipShelled && isShipDestroyed ? allShipTiles : null,
      timestamp,
    });
    io.to(this.ID).emit("game:gameLog", this.gameLog);

    const checkIfPlayerWon = (playerID: string): boolean => {
      if (playerID !== this.player1?.ID && playerID !== this.player2?.ID)
        throw new Error(`Invalid player ${playerID}`);
      const succeededShells = this.gameLog.filter(
        (log) => log.player === playerID && log.success
      );
      return succeededShells.length >= MAX_SHIP_PARTS;
    };

    if (checkIfPlayerWon(currentPlayer)) {
      io.to(this.player1.ID).emit("game:stage:over", {
        winner: currentPlayer,
        enemyShips: this.player2.ships,
      });
      io.to(this.player2.ID).emit("game:stage:over", {
        winner: currentPlayer,
        enemyShips: this.player1.ships,
      });
    }
  };

  private getCurrentPlayer = () => {
    const lastTurn = this.gameLog[this.gameLog.length - 1];
    if (!lastTurn) return this.player1?.ID;
    if (lastTurn.player === this.player2?.ID) {
      return lastTurn.success ? this.player2?.ID : this.player1?.ID;
    }
    if (lastTurn.player === this.player1?.ID && lastTurn.success)
      return this.player1?.ID;
    return this.player2?.ID;
  };

  get gameLog() {
    return this._gameLog;
  }
  set gameLog(newLog: LogEntry[]) {
    this._gameLog = newLog;
  }
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
