import { ClientLogEntry, GameStage, Player } from "@shared/types";
import { ShipType } from "Game/ShipDocks/types";
import { FIGHTING, GAME_OVER, PLANNING } from "shared/constants";

export const initialState = {
  enemyShips: [] as ShipType[],
  allyShips: [] as ShipType[],
  gameLog: [] as ClientLogEntry[],
  stage: PLANNING as GameStage,
  winner: null as null | Player,
};
type State = {
  enemyShips: ShipType[];
  allyShips: ShipType[];
  gameLog: ClientLogEntry[];
  stage: GameStage;
  winner: null | Player;
};
export type Action =
  | { type: typeof ACTION.RESET_STATES }
  | { type: typeof ACTION.END_GAME; payload: { winner: Player } }
  | {
      type: typeof ACTION.STORE_GAME_LOG;
      payload: { newLog: ClientLogEntry[] };
    }
  | { type: typeof ACTION.SET_STAGE; payload: { value: GameStage } }
  | { type: typeof ACTION.STORE_MOVE; payload: { value: ClientLogEntry } }
  | { type: typeof ACTION.DISPOSE_ENEMY; payload: { enemyShips: ShipType[] } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { allyShips: ShipType[]; enemyShips: ShipType[] };
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.START_GAME:
      return {
        ...state,
        stage: FIGHTING as GameStage,
        enemyShips: action.payload.enemyShips,
        allyShips: action.payload.allyShips,
      };
    case ACTION.DISPOSE_ENEMY:
      return {
        ...state,
        enemyShips: action.payload.enemyShips,
      };
    case ACTION.SET_STAGE:
      return {
        ...state,
        stage: action.payload.value,
      };
    case ACTION.STORE_MOVE: {
      return {
        ...state,
        gameLog: [...state.gameLog, action.payload.value],
      };
    }
    case ACTION.STORE_GAME_LOG: {
      return {
        ...state,
        gameLog: action.payload.newLog,
      };
    }
    case ACTION.END_GAME: {
      return {
        ...state,
        winner: action.payload.winner,
        stage: GAME_OVER as GameStage,
      };
    }
    case ACTION.RESET_STATES: {
      return {
        ...initialState,
      };
    }
    default:
      throw new Error(`Invalid action ${action} in game context.`);
  }
};

export const ACTION = {
  SET_STAGE: "set_game_stage" as "set_game_stage",
  START_GAME: "start_game" as "start_game",
  STORE_MOVE: "update_game_log" as "update_game_log",
  END_GAME: "end game" as "end game",
  RESET_STATES: "play again" as "play again",
  STORE_GAME_LOG: "store new log" as "store new log",
  DISPOSE_ENEMY: "dispose enemy" as "dispose enemy",
};
