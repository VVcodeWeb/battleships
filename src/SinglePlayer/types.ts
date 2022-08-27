import {
  BOT,
  FIGHTING,
  GAME_OVER,
  HUMAN,
  PLANNING,
  READY,
} from "constants/const";
import { ShipNames } from "ShipDocks/types";

export type Player = typeof BOT | typeof HUMAN;
export type LogEntry = {
  player: Player;
  x: number;
  y: number;
  success: boolean;
  notificated?: boolean;
};

export type ShipOnBoardAI = {
  x: number;
  y: number;
  damaged: boolean;
  name: ShipNames;
};
export type StageType =
  | typeof PLANNING
  | typeof FIGHTING
  | typeof READY
  | typeof GAME_OVER;
