import {
  BOT,
  FIGHTING,
  GAME_OVER,
  HUMAN,
  PLANNING,
  READY,
} from "constants/const";
import { ShipType } from "SinglePlayer/ShipDocks/types";

export type Player = typeof BOT | typeof HUMAN;
export type LogEntry = {
  player: Player;
  x: number;
  y: number;
  success: boolean;
  destroyed: ShipType[] | null;
};

export type StageType =
  | typeof PLANNING
  | typeof READY
  | typeof FIGHTING
  | typeof GAME_OVER;
