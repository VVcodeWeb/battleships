import React, { useEffect, useReducer } from "react";

import {
  BOT,
  FIGHTING,
  GAME_OVER,
  HUMAN,
  MAX_SHIP_PARTS,
  PLANNING,
  READY,
} from "constants/const";
import { LogEntry, Player, StageType } from "SinglePlayer/types";
import { generateBoardAI, takeTurnAI } from "utils/ai";
import { ShipType } from "SinglePlayer/ShipDocks/types";

const initialState = {
  enemyShips: [] as ShipType[],
  allyShips: [] as ShipType[],
  gameLog: [] as LogEntry[],
  gameStage: PLANNING as StageType,
  playersTurn: null as null | Player,
  winner: null as null | Player,
};
type State = {
  enemyShips: ShipType[];
  allyShips: ShipType[];
  gameLog: LogEntry[];
  gameStage: StageType;
  playersTurn: null | Player;
  winner: null | Player;
};
type Action =
  | { type: typeof ACTION.RESET_STATES }
  | { type: typeof ACTION.END_GAME; payload: { winner: Player } }
  | { type: typeof ACTION.NEXT_PLAYER_TURN }
  | { type: typeof ACTION.SET_GAME_STAGE; payload: { value: StageType } }
  | { type: typeof ACTION.STORE_AND_PASS_MOVE; payload: { value: LogEntry } }
  | { type: typeof ACTION.HIT_AI_SHIP; payload: { x: number; y: number } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { humanBoard: ShipType[] };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.SET_GAME_STAGE:
      return {
        ...state,
        gameStage: action.payload.value,
      };
    case ACTION.START_GAME:
      return {
        ...state,
        gameStage: FIGHTING as StageType,
        playersTurn: HUMAN as Player | null,
        enemyShips: generateBoardAI().enemyShips,
        allyShips: action.payload.humanBoard,
      };

    case ACTION.STORE_AND_PASS_MOVE: {
      return {
        ...state,
        gameLog: [...state.gameLog, action.payload.value],
        playersTurn:
          action.payload.value.player === HUMAN ? BOT : (HUMAN as Player),
      };
    }
    //for testing
    case ACTION.HIT_AI_SHIP: {
      return {
        ...state,
        enemyShips: state.enemyShips.map((ship) => {
          if (ship.x === action.payload.x && ship.y === action.payload.y)
            return { ...ship, damaged: true };
          return ship;
        }),
      };
    }
    case ACTION.END_GAME: {
      return {
        ...state,
        winner: action.payload.winner,
        gameStage: GAME_OVER as StageType,
      };
    }
    case ACTION.RESET_STATES: {
      return {
        ...initialState,
      };
    }
    default:
      throw new Error(`Invalid action ${action} game context`);
  }
};

export const ACTION = {
  SET_GAME_STAGE: "set_game_stage" as "set_game_stage",
  START_GAME: "start_game" as "start_game",
  STORE_AND_PASS_MOVE: "update_game_log" as "update_game_log",
  HIT_AI_SHIP: "hit_ai_ship" as "hit_ai_ship",
  NEXT_PLAYER_TURN: "next player turn" as "next player turn",
  END_GAME: "end game" as "end game",
  RESET_STATES: "play again" as "play again",
};
export const GameContext = React.createContext({
  ...initialState,
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  getHumansBoardAndStart: (board: ShipType[]) => {},
  playAgain: () => {},
  surrender: () => {},
  disposeEnemy: (): ShipType[] => [],
});

//TODO: remove damaged field after testing
const GameProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });
  const surrender = () => setWinner(BOT);
  const setWinner = (value: Player) =>
    dispatch({ type: ACTION.END_GAME, payload: { winner: value } });

  const isDuplicateMove = (x: number, y: number, player: Player) =>
    Boolean(
      state.gameLog.find(
        (log) => log.x === x && log.y === y && log.player === player
      )
    );
  const setGameStage = (value: StageType) => {
    if (state.gameStage === FIGHTING) {
      throw new Error(`Cant change gameStage from FIGHTING to ${value}`);
    }
    if (value !== state.gameStage)
      dispatch({ type: ACTION.SET_GAME_STAGE, payload: { value } });
  };

  const getHumansBoardAndStart = (board: ShipType[]) => {
    if (state.gameStage === READY)
      dispatch({ type: ACTION.START_GAME, payload: { humanBoard: board } });
    else throw new Error(`Gets humans board at ${state.gameStage} game stage`);
  };
  const disposeEnemy = () => state.enemyShips;

  /* check for win condition */
  useEffect(() => {
    const checkIfPlayerWon = (player: Player): boolean => {
      if (player !== HUMAN && player !== BOT)
        throw new Error(`Invalid player ${player}`);
      const succeededShells = state.gameLog.filter(
        (log) => log.player === (player === HUMAN ? HUMAN : BOT) && log.success
      );
      return succeededShells.length >= MAX_SHIP_PARTS;
    };
    if (checkIfPlayerWon(HUMAN)) setWinner(HUMAN);
    if (checkIfPlayerWon(BOT)) setWinner(BOT);
  }, [state.gameLog]);

  const makeMove = ({
    x,
    y,
    player,
  }: {
    x: number;
    y: number;
    player: Player;
  }) => {
    if (player !== state.playersTurn)
      throw new Error(`Player ${player} makes move during enemy turn`);
    if (isDuplicateMove(x, y, player))
      throw new Error(`Duplicate move ${x}:${y} by ${player}`);

    const shipsToCheck = player === HUMAN ? state.enemyShips : state.allyShips;
    const didHit = shipsToCheck.find((ship) => ship.x === x && ship.y === y);

    dispatch({
      type: ACTION.STORE_AND_PASS_MOVE,
      payload: {
        value: {
          player,
          x,
          y,
          success: Boolean(didHit),
        },
      },
    });
    //testing, delete after
    if (didHit && player === HUMAN) {
      dispatch({ type: ACTION.HIT_AI_SHIP, payload: { x, y } });
    }
  };

  /* BOT takes a turn */
  useEffect(() => {
    if (
      state.playersTurn === BOT &&
      state.gameLog[state.gameLog.length - 1].player === HUMAN
    ) {
      setTimeout(() => {
        const { x, y } = takeTurnAI({ gameLog: state.gameLog });
        if (isDuplicateMove(x, y, BOT))
          throw new Error(`Duplicate move ${x}:${y} by ${BOT}`);
        const didHit = state.allyShips.find(
          (ship) => ship.x === x && ship.y === y
        );
        dispatch({
          type: ACTION.STORE_AND_PASS_MOVE,
          payload: {
            value: {
              player: BOT,
              x,
              y,
              success: Boolean(didHit),
            },
          },
        });
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.gameLog, state.playersTurn]);
  return (
    <GameContext.Provider
      value={{
        ...state,
        setGameStage,
        makeMove,
        getHumansBoardAndStart,
        playAgain,
        surrender,
        disposeEnemy,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
