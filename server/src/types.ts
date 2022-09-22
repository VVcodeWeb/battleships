import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
//TODO: share code with frontend to avoid repeating code
export type LogEntry = {
  player: string;
  x: number;
  y: number;
  success: boolean;
  destroyed: any[] | null;
  timestamp: number;
};
export const LOBBY = "lobby";
export const PLANNING = "planning";
export const FIGHTING = "figthing";
export type GameStage = typeof LOBBY | typeof PLANNING | typeof FIGHTING;

export const MAX_SHIP_PARTS = 18;

export type IOtype = Server<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  any
>;

export type Player = {
  ID: string;
  status: GameStage | "ready";
  connected: boolean;
  ships: any[];
};
export type RoomType = {
  ID: string;
  player1: Player | null;
  player2: Player | null;
  gameLog: LogEntry[];
  stage: GameStage;
};
