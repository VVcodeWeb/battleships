import { BOT, FIGHTING, HUMAN, PLANNING, READY } from "constants/const";
import { ShipNames } from "ShipDocks/types";
import { ACTION } from "SinglePlayer/context/useGameContext";

export type Player = typeof BOT | typeof HUMAN;
export type LogEntry = {
  player: Player;
  x: number;
  y: number;
  success: boolean;
  notificated?: boolean;
};
export type State = {
  gameStage: StageType;
  gameLog: LogEntry[];
  playersTurn: null | Player;
  shipsOnBoardAI: ShipOnBoardAI[];
  shipsOnBoardHuman: ShipOnBoardAI[];
};
export type Action =
  | { type: typeof ACTION.NEXT_PLAYER_TURN }
  | { type: typeof ACTION.SET_GAME_STAGE; payload: { value: StageType } }
  | { type: typeof ACTION.UPDATE_GAME_LOG; payload: { value: LogEntry } }
  | { type: typeof ACTION.HIT_AI_SHIP; payload: { x: number; y: number } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { humanBoard: ShipOnBoardAI[] };
    };

export type ShipOnBoardAI = {
  x: number;
  y: number;
  damaged: boolean;
  name: ShipNames;
};
export type StageType = typeof PLANNING | typeof FIGHTING | typeof READY;
