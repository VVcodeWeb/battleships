import React, { useCallback, useEffect, useReducer } from "react";

import { BOT, FIGHTING, HUMAN, PLANNING, READY } from "constants/const";
import {
  LogEntry,
  Player,
  ShipOnBoardAI,
  Action,
  StageType,
  State,
} from "SinglePlayer/types";
import { generateBoardAI } from "utils/ai";
import { getRandomCoordinate } from "utils";

const initialState = {
  gameStage: PLANNING as StageType,
  gameLog: [] as LogEntry[],
  playersTurn: null as null | Player,
  shipsOnBoardAI: [] as ShipOnBoardAI[],
  shipsOnBoardHuman: [] as ShipOnBoardAI[],
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
        shipsOnBoardAI: generateBoardAI(),
        shipsOnBoardHuman: action.payload.humanBoard,
      };

    case ACTION.UPDATE_GAME_LOG: {
      return {
        ...state,
        gameLog: [...state.gameLog, action.payload.value],
      };
    }
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
    case ACTION.NEXT_PLAYER_TURN: {
      return {
        ...state,
        playersTurn: state.playersTurn === HUMAN ? BOT : (HUMAN as Player),
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
};
export const GameContext = React.createContext({
  ...initialState,
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  getHumansBoardAndStart: (board: ShipOnBoardAI[]) => {},
});

//TODO: remove damaged field after testing
const GameProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
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
    else throw new Error(`Gets humans board at ${state.gameStage}`);
  };

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
    let didHit;
    if (player === HUMAN) {
      didHit = state.shipsOnBoardAI.find(
        (ship) => ship.x === x && ship.y === y
      );
    } else {
      didHit = state.shipsOnBoardHuman.find(
        (ship) => ship.x === x && ship.y === y
      );
    }
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
    dispatch({ type: ACTION.NEXT_PLAYER_TURN });
  };

  //BOT takes a turn
  useEffect(() => {
    if (state.playersTurn === BOT) {
      setTimeout(() => {
        const tilesShelledByBot = state.gameLog.filter(
          (log) => log.player === BOT
        );
        const failedShots = tilesShelledByBot.filter((log) => !log.success);
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
            dispatch({ type: ACTION.NEXT_PLAYER_TURN });
            moveMade = true;
          }
        }
      }, 5000);
    }
  }, [state.gameLog, state.playersTurn, state.shipsOnBoardHuman]);
  return (
    <GameContext.Provider
      value={{ ...state, setGameStage, makeMove, getHumansBoardAndStart }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
