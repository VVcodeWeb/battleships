import React, { useCallback, useEffect, useReducer } from "react";

import {
  ENEMY,
  FIGHTING,
  GAME_OVER,
  ALLY,
  MAX_SHIP_PARTS,
  READY,
} from "constants/const";
import { Player, StageType } from "Game/types";
import { ShipType } from "Game/ShipDocks/types";
import { ACTION, initialState, reducer } from "reducer";
import useSocket from "MultiPlayer/hooks/useSocket";

export const LOBBY = "lobby";

export const MultiPlayerContext = React.createContext({
  ...{ ...initialState, stage: LOBBY },
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  finishPlanning: (board: ShipType[]) => {},
  playAgain: () => {},
  surrender: () => {},
  disposeEnemy: (): ShipType[] => [],
  getCurrentPlayer: (): Player => ALLY,
});

const MultiPlayerProvider = ({ children }: any) => {
  const [{ allyShips, enemyShips, gameLog, stage, winner }, dispatch] =
    useReducer(reducer, { ...initialState, stage: LOBBY });

  const { gameStageListener, playerIsReady } = useSocket();
  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });

  const surrender = () => setWinner(ENEMY);
  const setWinner = (value: Player) =>
    dispatch({ type: ACTION.END_GAME, payload: { winner: value } });
  const disposeEnemy = () => {
    if (stage !== GAME_OVER)
      throw new Error("Trying to dispose the enemy during the game");
    return enemyShips;
  };
  //todo add handler for READY -> PLANNING stage switch
  const setGameStage = (value: StageType) => {
    console.log({ stage, value });
    if (stage === FIGHTING) {
      throw new Error(`Cant change stage from FIGHTING to ${value}`);
    }
    dispatch({ type: ACTION.SET_STAGE, payload: { value } });
  };

  const finishPlanning = (allyBoard: ShipType[]) => {
    if (stage === READY) {
      playerIsReady(allyBoard, (enemyBoard) => {
        dispatch({
          type: ACTION.START_GAME,
          payload: {
            allyBoard,
            enemyBoard,
          },
        });
      });
    } else throw new Error(`Gets humans board at ${stage} game stage`);
  };

  /* check for win condition */
  useEffect(() => {
    const checkIfPlayerWon = (player: Player): boolean => {
      if (player !== ALLY && player !== ENEMY)
        throw new Error(`Invalid player ${player}`);
      const succeededShells = gameLog.filter(
        (log) => log.player === (player === ALLY ? ALLY : ENEMY) && log.success
      );
      return succeededShells.length >= MAX_SHIP_PARTS;
    };
    if (checkIfPlayerWon(ALLY)) setWinner(ALLY);
    if (checkIfPlayerWon(ENEMY)) setWinner(ENEMY);
  }, [gameLog]);

  const getCurrentPlayer = useCallback((): Player => {
    const lastTurn = gameLog[gameLog.length - 1];
    if (!lastTurn) return ALLY;
    if (lastTurn.player === ENEMY) {
      return lastTurn.success ? ENEMY : ALLY;
    }
    if (lastTurn.player === ALLY && lastTurn.success) return ALLY;
    return ENEMY;
  }, [gameLog]);

  const makeMove = ({
    x,
    y,
    player,
  }: {
    x: number;
    y: number;
    player: Player;
  }) => {
    if (stage !== FIGHTING) throw new Error(`Not a fighting stage`);
    if (player !== getCurrentPlayer())
      throw new Error(`Player ${player} makes move during enemy turn`);
  };

  return (
    <MultiPlayerContext.Provider
      value={{
        gameLog,
        stage,
        winner,
        allyShips,
        enemyShips,
        setGameStage,
        makeMove,
        finishPlanning,
        playAgain,
        surrender,
        disposeEnemy,
        getCurrentPlayer,
      }}
    >
      {children}
    </MultiPlayerContext.Provider>
  );
};

export default MultiPlayerProvider;
