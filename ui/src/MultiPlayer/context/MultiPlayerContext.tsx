import React, { memo, useContext, useMemo, useReducer, useState } from "react";

import { ENEMY, ALLY } from "shared/constants";
import { ShipType } from "Game/ShipDocks/types";
import { ACTION, initialState, reducer } from "reducer";
import {
  FIGHTING,
  GAME_OVER,
  READY,
  WAITING_FOR_PLAYERS,
} from "shared/constants";
import {
  ClientLogEntry,
  FightingStageData,
  GameOverData,
  GameStage,
  Player,
  ServerLogEntry,
} from "@shared/types";
import { SocketContext } from "MultiPlayer/context/SocketContext";
import { useParams } from "react-router-dom";
import { UserContext } from "MultiPlayer/context/UserContext";

export const MultiPlayerContext = React.createContext({
  ...{ ...initialState, stage: WAITING_FOR_PLAYERS as GameStage },
  currentPlayersTurn: ALLY as Player,
  setGameStage: (value: GameStage) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  finishPlanning: (board: ShipType[]) => {},
  playAgain: () => {},
  surrender: () => {},
  disposeEnemy: (): ShipType[] => [],
  updateGameLog: (gameLog: ServerLogEntry[]) => {},
  gameOver: (data: GameOverData) => {},
  serverStartsGame: (data: FightingStageData) => {},
});

const MultiPlayerProvider = ({ children }: any) => {
  const [{ allyShips, enemyShips, gameLog, stage, winner }, dispatch] =
    useReducer(reducer, { ...initialState, stage: WAITING_FOR_PLAYERS });

  const { userId } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { roomID } = useParams();
  const [isMyFirstTurn, setIsMyFirstTurn] = useState<boolean | null>(null);
  //TODO: refactor
  const [tempShips, setTempShips] = useState<ShipType[]>([]);

  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });

  const surrender = () => {
    alert("not implemented");
  };
  const gameOver = (data: GameOverData) => {
    const winner = data.winner === userId ? ALLY : ENEMY;
    dispatch({
      type: ACTION.END_GAME,
      payload: { winner },
    });
    dispatch({
      type: ACTION.DISPOSE_ENEMY,
      payload: {
        enemyShips: winner === ALLY ? data.loserShips : data.winnerShips,
      },
    });
  };
  const disposeEnemy = () => {
    if (stage !== GAME_OVER)
      throw new Error("Trying to dispose the enemy during the game");
    return enemyShips;
  };
  const setGameStage = (value: GameStage) => {
    if (stage === FIGHTING) {
      throw new Error(`Cant change stage from FIGHTING to ${value}`);
    }
    if (stage !== value)
      dispatch({ type: ACTION.SET_STAGE, payload: { value } });
  };
  const finishPlanning = (allyShips: ShipType[]) => {
    if (!roomID) throw new Error(`Something very unusual happend`);
    if (stage === READY)
      socket.emit("player:ready", roomID, allyShips, (response) => {
        console.log(response);
        if (response.error) {
          console.log(`Error player:ready event emit`);
        } else {
          setTempShips(allyShips);
        }
      });
    else throw new Error(`Gets humans board at ${stage} game stage`);
  };

  const serverStartsGame = (data: FightingStageData) => {
    setIsMyFirstTurn(data.firstMove === userId);
    dispatch({
      type: ACTION.START_GAME,
      payload: {
        allyShips: tempShips,
        enemyShips: [],
      },
    });
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
    console.log(`Player moves: ${x} ${y}`);
    if (!roomID) throw new Error(`Something very unusual happend`);
    if (stage !== FIGHTING) throw new Error(`Not a fighting stage`);
    if (player !== currentPlayersTurn)
      throw new Error(`Player ${player} makes move during enemy turn`);

    socket.emit("player:move", roomID, { x, y }, (response) => {
      console.log(`Player move response ${response}`);
    });
  };

  const updateGameLog = (newLog: ServerLogEntry[]) => {
    console.log({ serverLog: newLog });
    const formatLog: ClientLogEntry[] = newLog.map((log) => ({
      ...log,
      player: log.player === userId ? ALLY : ENEMY,
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
        serverStartsGame,
      }}
    >
      {children}
    </MultiPlayerContext.Provider>
  );
};

export default memo(MultiPlayerProvider);
