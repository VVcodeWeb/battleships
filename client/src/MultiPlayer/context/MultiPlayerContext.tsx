import React, { memo, useMemo, useReducer, useState } from "react";

import { ENEMY, FIGHTING, GAME_OVER, ALLY, READY } from "constants/const";
import { LogEntry, Player, StageType } from "Game/types";
import { ShipType } from "Game/ShipDocks/types";
import { ACTION, initialState, reducer } from "reducer";
import useSocket from "MultiPlayer/hooks/useSocket";

export const LOBBY = "lobby";

export const MultiPlayerContext = React.createContext({
  ...{ ...initialState, stage: LOBBY as StageType },
  currentPlayersTurn: ALLY as Player,
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  finishPlanning: (board: ShipType[]) => {},
  playAgain: () => {},
  surrender: () => {},
  disposeEnemy: (): ShipType[] => [],
  updateGameLog: (gameLog: LogEntry[]) => {},
  gameOver: (winner: string, enemyShips: ShipType[]) => {},
});

const MultiPlayerProvider = ({ children }: any) => {
  const [{ allyShips, enemyShips, gameLog, stage, winner }, dispatch] =
    useReducer(reducer, { ...initialState, stage: LOBBY });

  const [isMyFirstTurn, setIsMyFirstTurn] = useState<boolean>(false);
  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });
  const { playerIsReady, socketID, playerTakesTurn } = useSocket();

  const surrender = () => {
    alert("not implemented");
  };
  const gameOver = (winner: string, enemyShips: ShipType[]) => {
    dispatch({
      type: ACTION.END_GAME,
      payload: { winner: winner === socketID ? ALLY : ENEMY },
    });
    dispatch({ type: ACTION.DISPOSE_ENEMY, payload: { enemyShips } });
  };
  const disposeEnemy = () => {
    if (stage !== GAME_OVER)
      throw new Error("Trying to dispose the enemy during the game");
    return enemyShips;
  };
  //todo add handler for READY -> PLANNING stage switch
  const setGameStage = (value: StageType) => {
    if (stage === FIGHTING) {
      throw new Error(`Cant change stage from FIGHTING to ${value}`);
    }
    if (stage !== value)
      dispatch({ type: ACTION.SET_STAGE, payload: { value } });
  };
  const finishPlanning = (allyShips: ShipType[]) => {
    if (stage === READY)
      playerIsReady(allyShips, (firstTurnPlayer) => {
        if (firstTurnPlayer === socketID) setIsMyFirstTurn(true);
        dispatch({
          type: ACTION.START_GAME,
          payload: {
            allyShips,
            enemyShips: [],
          },
        });
      });
    else throw new Error(`Gets humans board at ${stage} game stage`);
  };

  const currentPlayersTurn = useMemo((): Player => {
    const lastTurn = gameLog[gameLog.length - 1];
    if (!lastTurn) return isMyFirstTurn ? ALLY : ENEMY;
    if (lastTurn.player === ENEMY) return lastTurn.success ? ENEMY : ALLY;
    if (lastTurn.player === ALLY && lastTurn.success) return ALLY;
    return ENEMY;
  }, [gameLog, isMyFirstTurn]);

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
    if (player !== currentPlayersTurn)
      throw new Error(`Player ${player} makes move during enemy turn`);

    playerTakesTurn(x, y);
  };

  const updateGameLog = (newLog: LogEntry[]) => {
    console.log({ serverLog: newLog });
    const formatLog: LogEntry[] = newLog.map((log) => ({
      ...log,
      player: log.player === socketID ? ALLY : ENEMY,
    }));
    dispatch({ type: ACTION.STORE_GAME_LOG, payload: { newLog: formatLog } });
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
        currentPlayersTurn,
        updateGameLog,
        gameOver,
      }}
    >
      {children}
    </MultiPlayerContext.Provider>
  );
};

export default memo(MultiPlayerProvider);
