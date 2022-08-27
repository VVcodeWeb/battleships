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
import { LogEntry, Player, ShipOnBoardAI, StageType } from "SinglePlayer/types";
import { generateBoardAI } from "utils/ai";
import { getRandomCoordinate } from "utils";

const initialState = {
  gameStage: PLANNING as StageType,
  gameLog: [] as LogEntry[],
  playersTurn: null as null | Player,
  shipsOnBoardAI: [] as ShipOnBoardAI[],
  shipsOnBoardHuman: [] as ShipOnBoardAI[],
  winner: null as null | Player,
};
type State = {
  gameStage: StageType;
  gameLog: LogEntry[];
  playersTurn: null | Player;
  shipsOnBoardAI: ShipOnBoardAI[];
  shipsOnBoardHuman: ShipOnBoardAI[];
  winner: null | Player;
};
type Action =
  | { type: typeof ACTION.PLAY_AGAIN }
  | { type: typeof ACTION.END_GAME; payload: { winner: Player } }
  | { type: typeof ACTION.NEXT_PLAYER_TURN }
  | { type: typeof ACTION.SET_GAME_STAGE; payload: { value: StageType } }
  | { type: typeof ACTION.UPDATE_GAME_LOG; payload: { value: LogEntry } }
  | { type: typeof ACTION.HIT_AI_SHIP; payload: { x: number; y: number } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { humanBoard: ShipOnBoardAI[] };
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
        shipsOnBoardAI: generateBoardAI().shipsOnBoardAI,
        shipsOnBoardHuman: action.payload.humanBoard,
      };

    case ACTION.UPDATE_GAME_LOG: {
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
        shipsOnBoardAI: state.shipsOnBoardAI.map((ship) => {
          if (ship.x === action.payload.x && ship.y === action.payload.y)
            return { ...ship, damaged: true };
          return ship;
        }),
      };
    }
    //Deprecated
    case ACTION.NEXT_PLAYER_TURN: {
      return {
        ...state,
        playersTurn: state.playersTurn === HUMAN ? BOT : (HUMAN as Player),
      };
    }
    case ACTION.END_GAME: {
      return {
        ...state,
        winner: action.payload.winner,
        gameStage: GAME_OVER as StageType,
      };
    }
    case ACTION.PLAY_AGAIN: {
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
  UPDATE_GAME_LOG: "update_game_log" as "update_game_log",
  HIT_AI_SHIP: "hit_ai_ship" as "hit_ai_ship",
  NEXT_PLAYER_TURN: "next player turn" as "next player turn",
  END_GAME: "end game" as "end game",
  PLAY_AGAIN: "play again" as "play again",
};
export const GameContext = React.createContext({
  ...initialState,
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  getHumansBoardAndStart: (board: ShipOnBoardAI[]) => {},
  playAgain: () => {},
  surrender: () => {},
});

//TODO: remove damaged field after testing
const GameProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const playAgain = () => dispatch({ type: ACTION.PLAY_AGAIN });
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

  const getHumansBoardAndStart = (board: ShipOnBoardAI[]) => {
    if (state.gameStage === READY)
      dispatch({ type: ACTION.START_GAME, payload: { humanBoard: board } });
    else throw new Error(`Gets humans board at ${state.gameStage} game stage`);
  };

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

    const shipsToCheck =
      player === HUMAN ? state.shipsOnBoardAI : state.shipsOnBoardHuman;
    const didHit = shipsToCheck.find((ship) => ship.x === x && ship.y === y);

    dispatch({
      type: ACTION.UPDATE_GAME_LOG,
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
    if (state.playersTurn === BOT) {
      setTimeout(() => {
        const tilesShelledByBot = state.gameLog.filter(
          (log) => log.player === BOT
        );
        let moveMade = false;
        while (!moveMade) {
          const { x, y } = getRandomCoordinate();
          const alreadyShelled = tilesShelledByBot.find(
            (l) => l.x === x && l.y === y
          );
          if (!alreadyShelled) {
            const didHit = state.shipsOnBoardHuman.find(
              (ship) => ship.x === x && ship.y === y
            );
            dispatch({
              type: ACTION.UPDATE_GAME_LOG,
              payload: {
                value: {
                  player: BOT,
                  x,
                  y,
                  success: Boolean(didHit),
                },
              },
            });
            moveMade = true;
          }
        }
      }, 200);
    }
  }, [state.gameLog, state.playersTurn, state.shipsOnBoardHuman]);
  return (
    <GameContext.Provider
      value={{
        ...state,
        setGameStage,
        makeMove,
        getHumansBoardAndStart,
        playAgain,
        surrender,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
