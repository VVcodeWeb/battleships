import {
  ENEMY,
  FIGHTING,
  GAME_OVER,
  ALLY,
  PLANNING,
  READY,
} from "constants/const";
import { ShipType } from "Game/ShipDocks/types";
import { LOBBY } from "MultiPlayer/context/MultiPlayerContext";

export type Player = typeof ENEMY | typeof ALLY;
export type LogEntry = {
  player: Player;
  x: number;
  y: number;
  success: boolean;
  destroyed: ShipType[] | null;
  timestamp: number;
};

export type StageType =
  | typeof LOBBY
  | typeof PLANNING
  | typeof READY
  | typeof FIGHTING
  | typeof GAME_OVER;
