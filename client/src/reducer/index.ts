import { PLANNING, FIGHTING, GAME_OVER } from "constants/const";
import { ShipType } from "Game/ShipDocks/types";
import { LogEntry, StageType, Player } from "Game/types";

export const initialState = {
  enemyShips: [] as ShipType[],
  allyShips: [] as ShipType[],
  gameLog: [] as LogEntry[],
  stage: PLANNING as StageType,
  winner: null as null | Player,
};
type State = {
  enemyShips: ShipType[];
  allyShips: ShipType[];
  gameLog: LogEntry[];
  stage: StageType;
  winner: null | Player;
};
export type Action =
  | { type: typeof ACTION.RESET_STATES }
  | { type: typeof ACTION.END_GAME; payload: { winner: Player } }
  | { type: typeof ACTION.SET_STAGE; payload: { value: StageType } }
  | { type: typeof ACTION.STORE_MOVE; payload: { value: LogEntry } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { allyBoard: ShipType[]; enemyBoard: ShipType[] };
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.START_GAME:
      return {
        ...state,
        stage: FIGHTING as StageType,
        enemyShips: action.payload.enemyBoard,
        allyShips: action.payload.allyBoard,
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
    case ACTION.END_GAME: {
      return {
        ...state,
        winner: action.payload.winner,
        stage: GAME_OVER as StageType,
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
};
