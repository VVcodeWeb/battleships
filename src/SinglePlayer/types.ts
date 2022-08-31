import {
  BOT,
  FIGHTING,
  GAME_OVER,
  HUMAN,
  PLANNING,
  READY,
} from "constants/const";

export type Player = typeof BOT | typeof HUMAN;
export type LogEntry = {
  player: Player;
  x: number;
  y: number;
  success: boolean;
  notificated?: boolean;
};

export type StageType =
  | typeof PLANNING
  | typeof READY
  | typeof FIGHTING
  | typeof GAME_OVER;
