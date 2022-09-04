import React, { useCallback, useEffect, useReducer } from "react";

import _ from "underscore";

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
import { generateBoardAI, getAttackTarget } from "utils/ai";
import { ShipType } from "SinglePlayer/ShipDocks/types";
import { areXYsEual, delay } from "utils";

const initialState = {
  enemyShips: [] as ShipType[],
  allyShips: [] as ShipType[],
  gameLog: [] as LogEntry[],
  gameStage: PLANNING as StageType,
  winner: null as null | Player,
};
type State = {
  enemyShips: ShipType[];
  allyShips: ShipType[];
  gameLog: LogEntry[];
  gameStage: StageType;
  winner: null | Player;
};
type Action =
  | { type: typeof ACTION.RESET_STATES }
  | { type: typeof ACTION.END_GAME; payload: { winner: Player } }
  | { type: typeof ACTION.SET_GAME_STAGE; payload: { value: StageType } }
  | { type: typeof ACTION.STORE_MOVE; payload: { value: LogEntry } }
  | {
      type: typeof ACTION.START_GAME;
      payload: { humanBoard: ShipType[] };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ACTION.START_GAME:
      return {
        ...state,
        gameStage: FIGHTING as StageType,
        enemyShips: generateBoardAI().enemyShips,
        allyShips: action.payload.humanBoard,
      };
    case ACTION.SET_GAME_STAGE:
      return {
        ...state,
        gameStage: action.payload.value,
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
        gameStage: GAME_OVER as StageType,
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
  SET_GAME_STAGE: "set_game_stage" as "set_game_stage",
  START_GAME: "start_game" as "start_game",
  STORE_MOVE: "update_game_log" as "update_game_log",
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
  getCurrentPlayer: (): Player => HUMAN,
});

const GameProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });
  const surrender = () => setWinner(BOT);
  const setWinner = (value: Player) =>
    dispatch({ type: ACTION.END_GAME, payload: { winner: value } });
  const disposeEnemy = () => {
    /* if (state.gameStage !== GAME_OVER)
      throw new Error("Trying to dispose the enemy during the game"); */
    return state.enemyShips;
  };

  const isDuplicateMove = (
    x: number,
    y: number,
    player: Player,
    logs: LogEntry[]
  ) =>
    Boolean(
      logs.find((log) => log.x === x && log.y === y && log.player === player)
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

  const getCurrentPlayer = useCallback((): Player => {
    const lastTurn = state.gameLog[state.gameLog.length - 1];
    if (!lastTurn) return HUMAN;
    if (lastTurn.player === BOT) {
      return lastTurn.success ? BOT : HUMAN;
    }
    if (lastTurn.player === HUMAN && lastTurn.success) return HUMAN;
    return BOT;
  }, [state.gameLog]);

  //TODO: confirm player doesnt shell blocked tile.
  const makeMove = useCallback(
    ({ x, y, player }: { x: number; y: number; player: Player }) => {
      if (player !== getCurrentPlayer())
        throw new Error(`Player ${player} makes move during enemy turn`);
      if (isDuplicateMove(x, y, player, state.gameLog))
        throw new Error(`Duplicate move ${x}:${y} by ${player}`);
      if (player === BOT) console.log({ x, y });
      const shipsTilesToCheck =
        player === HUMAN ? state.enemyShips : state.allyShips;
      const shipShelled = _.find(
        shipsTilesToCheck,
        (ship) => ship.x === x && ship.y === y
      );
      let isShipDestroyed = false;
      let allShipTiles: ShipType[] = [];
      if (shipShelled && player === HUMAN) {
        allShipTiles = _.filter(
          shipsTilesToCheck,
          (ship) => ship.name === shipShelled.name
        );
        isShipDestroyed = allShipTiles.every((shipTile) => {
          //current hit
          if (areXYsEual(shipTile.x, shipTile.y, x, y)) return true;
          //previous hits
          for (let log of state.gameLog.filter((l) => l.player === HUMAN)) {
            if (areXYsEual(shipTile.x, shipTile.y, log.x, log.y)) return true;
          }
          return false;
        });
        console.log({ isShipDestroyed });
      }
      if (player === BOT) console.log({ shipShelled });
      dispatch({
        type: ACTION.STORE_MOVE,
        payload: {
          value: {
            player,
            x,
            y,
            success: Boolean(shipShelled),
            destroyed: shipShelled && isShipDestroyed ? allShipTiles : null,
          },
        },
      });
    },
    [getCurrentPlayer, state.allyShips, state.enemyShips, state.gameLog]
  );

  /* BOT takes a turn */
  useEffect(() => {
    const takeTurnAI = async () => {
      await delay(500);
      const { x, y } = getAttackTarget({ gameLog: state.gameLog });
      makeMove({ x, y, player: BOT });
    };
    if (getCurrentPlayer() === BOT && state.gameStage === FIGHTING)
      takeTurnAI();
  }, [
    getCurrentPlayer,
    makeMove,
    state.allyShips,
    state.gameLog,
    state.gameStage,
  ]);
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
        getCurrentPlayer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
