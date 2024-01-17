import consola from "consola";
import { Server, Socket } from "socket.io";

import { Player, RoomType } from "../types";
import { redis } from "../db";
import { SocketHolder } from "./SocketHolder";
import {
  ClientToServerEvents,
  GameStage,
  ServerLogEntry,
  ServerToClientEvents,
  ShipType,
} from "shared/types";
import { Model } from "./Model";
import { FIGHTING, GAME_OVER, PLANNING } from "shared/constants";
import { checkIfPlayerWon, getMoveResult } from "shared/game";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { config } from "../config";

export default class Room implements Model {
  roomID: string;
  owner: Player;
  guest: Player | null;
  io: Server<ClientToServerEvents, ServerToClientEvents, DefaultEventsMap, any>;
  stage: GameStage;
  gameLog: ServerLogEntry[];

  constructor({ roomID, owner, guest, stage, gameLog }: RoomType) {
    this.roomID = roomID;
    this.owner = owner;
    this.guest = guest;
    this.stage = stage;
    this.gameLog = gameLog;
    if (!SocketHolder.io) throw new Error(`Socket io is not initialized`);
    this.io = SocketHolder.io;
  }

  async playerMoves(socket: Socket, move: { x: number; y: number }) {
    const userId = socket.data.userId;
    //move validation to be added
    if (!this.guest) throw new Error("Guest is undefined");
    if (this.stage !== FIGHTING)
      throw new Error(
        `Current stage is ${this.stage}. Player cant make moves ${FIGHTING}`
      );
    if (!userId) throw new Error("empty user id");

    const isOwner = this.isUserOwner(userId);
    const result = getMoveResult({
      ...move,
      player: userId,
      gameLog: this.gameLog,
      enemyShips: isOwner ? this.guest.ships : this.owner.ships,
    });
    //consola.log("Game log before the move", this.gameLog);
    this.gameLog.push({
      ...move,
      player: userId,
      timestamp: Date.now(),
      success: result.success,
      destroyed: result.destroyed,
    });
    if (checkIfPlayerWon({ gameLog: this.gameLog, player: userId })) {
      this.stage = GAME_OVER;
      await this.save();
      this.io.in(this.roomID).emit("stage:set", GAME_OVER, {
        winner: userId,
        winnerShips: isOwner ? this.owner.ships : this.guest.ships,
        loserShips: isOwner ? this.guest.ships : this.owner.ships,
      });
    } else await this.save();

    this.io.in(this.roomID).emit("game:update", this.gameLog);
  }

  async playerReady(socket: Socket, ships: ShipType[]) {
    if (!this.guest) throw new Error("Guest is undefined");
    if (this.stage !== PLANNING)
      throw new Error(
        `Current stage is ${this.stage}. Player cant submit his ships during stage other than ${PLANNING}`
      );
    const userId = socket.data.userId;
    if (!userId) throw new Error("empty user id");
    const isOwner = this.isUserOwner(userId);
    //add ships validation
    if (isOwner) this.owner.ships = ships;
    else this.guest.ships = ships;
    if (this.owner.ships.length > 0 && this.guest.ships.length > 0) {
      this.stage = FIGHTING;
      await this.save();
      this.io.in(this.roomID).emit("stage:set", FIGHTING, {
        firstMove:
          Math.round(Math.random()) === 1 ? this.owner.id : this.guest.id,
      });
    } else await this.save();
  }

  /**
   * If guest id is present and socket.userId doesnt belong to a guest or a owner, return error
   *
   * Futher action depend on this.stage. In case its waiting stage -> todo: finish
   *
   * @param socket.data.userId must be not null
   */
  async playerJoin(socket: Socket) {
    const userId = socket.data.userId;
    if (!userId) throw new Error("empty user id");
    const isOwner = userId === this.owner.id;
    if (!isOwner && this.guest && this.guest?.id !== userId) throw new Error();

    switch (this.stage) {
      case "waiting_for_players":
        if (!isOwner && !this.guest?.id) this.guest = { id: userId, ships: [] };
        await socket.join(this.roomID);
        if (await this.areAllPlayersConnected()) {
          this.stage = PLANNING;
          await this.save();
          this.io.in(this.roomID).emit("stage:set", PLANNING);
        }
      case "planning":
        break;
      case "figthing":
        break;
      default:
        throw new Error(`Unkown game stage ${this.stage}`);
    }
  }

  async save(): Promise<void> {
    await redis.set(
      this.roomID,
      JSON.stringify({
        owner: this.owner,
        guest: this.guest,
        roomID: this.roomID,
        stage: this.stage,
        gameLog: this.gameLog,
      })
    );
  }

  async delete(): Promise<void> {
    await redis.del(this.roomID);
  }

  static async find(id: string): Promise<Room | null> {
    const roomJSON = await redis.get(id);
    if (!roomJSON) {
      consola.warn(`Couldnt find the room with id ${id}`);
      return null;
    }

    const roomParsed: RoomType = JSON.parse(roomJSON);
    config.debug && consola.info("parsed game log", roomParsed.gameLog);
    return new Room({
      owner: roomParsed.owner,
      guest: roomParsed.guest,
      roomID: roomParsed.roomID,
      stage: roomParsed.stage,
      gameLog: roomParsed.gameLog,
    });
  }

  private isUserOwner(userId: string) {
    const isOwner =
      this.owner.id === userId
        ? true
        : this.guest?.id === userId
        ? false
        : null;
    if (isOwner === null)
      throw new Error(
        `User with such ID ${userId} doesnt belong to this room ${this.roomID}`
      );
    return isOwner;
  }

  private areAllPlayersConnected = async () => {
    const sockets = await this.io.in(this.roomID).fetchSockets();
    consola.info("Num of sockets in the room", sockets.length);
    const connectedSockets = sockets
      .map((socket) => {
        const id = socket.id;
        const socketClient = this.io.sockets.sockets.get(id);
        if (!socketClient) consola.error(`Couldnt find socket with id ${id}`);
        return {
          connected: socketClient?.connected,
          userId: socketClient?.data.userId,
        };
      })
      .filter((socket) => socket.connected);

    const ownerSocket = connectedSockets.find(
      (socket) => socket.userId === this.owner.id
    );
    const guestSocket = connectedSockets.find(
      (socket) => socket.userId === this.guest?.id
    );
    consola.info(
      "Players connected: ",
      ownerSocket?.userId,
      guestSocket?.userId
    );
    return guestSocket && ownerSocket;
  };

  print(message?: string) {
    consola.info(message, {
      roomID: this.roomID,
      owner: this.owner,
      guest: this.guest,
      stage: this.stage,
      gameLog: this.gameLog,
    });
  }
}
