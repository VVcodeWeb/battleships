import ShortUniqueId from "short-unique-id";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from ".";
import {
  GameStage,
  LogEntry,
  RoomType,
  LOBBY,
  PLANNING,
  FIGHTING,
  MAX_SHIP_PARTS,
  Player,
} from "./types";
import { areXYsEual } from "./utils";

const generateID = new ShortUniqueId({ length: 5 });
export default class Room {
  _ID: string;
  player1: Player | null;
  player2: Player | null;
  _stage: GameStage;
  _gameLog: LogEntry[] = [];

  constructor(room: RoomType) {
    this._ID = room.ID;
    this._stage = room.stage;
    this.player1 = room.player1;
    this.player2 = room.player2;
    this.gameLog = room.gameLog;
  }

  private isRoomFull = () => Boolean(this.player1) && Boolean(this.player2);
  private getPlayer = (ID: string) => {
    if (this.player1?.ID === ID) return this.player1;
    if (this.player2?.ID === ID) return this.player2;
    console.error("cant find player in the room");
    return null;
  };

  private getNewPlayer = (ID: string): Player => {
    return {
      ID,
      status: LOBBY,
      connected: true,
      ships: [],
    };
  };

  //TODO: finish
  private handleReconnect = (ID: string) => {
    console.log("Reconnect");
    if (this.getPlayer(ID)) console.log(`ALREADY IN THE ROOM ${ID}`);
  };

  private handleNewConnection = (socket: Socket) => {
    console.log("New connection");
    if (this.isRoomFull()) throw new Error("FULL ROOM");
    const newID = generateID();
    if (!this.player1) this.player1 = this.getNewPlayer(newID);
    else if (!this.player2) this.player2 = this.getNewPlayer(newID);
    socket.join(this.ID);
    console.log(`New user ${newID} created in the room`);
    io.to(this.ID).emit("room:joined", {
      players: [this.player1?.ID, this.player2?.ID],
      userID: newID,
    });

    if (this.isRoomFull()) {
      this.stage = PLANNING;
      io.to(this.ID).emit("game:stage:planning");
    }
  };
  joinRoom = (socket: Socket) => {
    const currentUserID = socket.data.userID;
    console.log(`User ${currentUserID} joining ${this.ID}`);
    if (currentUserID) this.handleReconnect(currentUserID);
    else this.handleNewConnection(socket);
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

  isFull = () => Boolean(this.player1) && Boolean(this.player2);

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
