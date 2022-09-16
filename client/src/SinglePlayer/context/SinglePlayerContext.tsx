import React, { useCallback, useEffect, useReducer } from "react";

import _ from "underscore";

import {
  ENEMY,
  FIGHTING,
  GAME_OVER,
  ALLY,
  MAX_SHIP_PARTS,
  READY,
  PLANNING,
} from "constants/const";
import { Player, StageType } from "Game/types";
import { generateBoardAI, getAttackTarget } from "utils/ai";
import { ShipType } from "Game/ShipDocks/types";
import { areXYsEual, delay } from "utils";
import { ACTION, initialState, reducer } from "reducer";

initialState.stage = PLANNING;
export const SinglePlayerContext = React.createContext({
  ...initialState,
  setGameStage: (value: StageType) => {},
  makeMove: ({ x, y, player }: { x: number; y: number; player: Player }) => {},
  finishPlanning: (board: ShipType[]) => {},
  playAgain: () => {},
  surrender: () => {},
  disposeEnemy: (): ShipType[] => [],
  getCurrentPlayer: (): Player => ALLY,
});

const SinglePlayerProvider = ({ children }: any) => {
  const [{ allyShips, enemyShips, gameLog, stage, winner }, dispatch] =
    useReducer(reducer, initialState);
  const playAgain = () => dispatch({ type: ACTION.RESET_STATES });
  const surrender = () => setWinner(ENEMY);
  const setWinner = (value: Player) =>
    dispatch({ type: ACTION.END_GAME, payload: { winner: value } });
  const disposeEnemy = () => {
    if (stage !== GAME_OVER)
      throw new Error("Trying to dispose the enemy during the game");
    return enemyShips;
  };
  const setGameStage = (value: StageType) => {
    console.log("Single player context");
    console.log({ stage, value });

    if (stage === FIGHTING) {
      throw new Error(`Cant change stage from FIGHTING to ${value}`);
    }
    if (value !== stage)
      dispatch({ type: ACTION.SET_STAGE, payload: { value } });
  };

  const finishPlanning = (board: ShipType[]) => {
    if (stage === READY)
      dispatch({
        type: ACTION.START_GAME,
        payload: {
          allyBoard: board,
          enemyBoard: generateBoardAI().enemyShips,
        },
      });
    else throw new Error(`Gets humans board at ${stage} game stage`);
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

  const makeMove = useCallback(
    ({ x, y, player }: { x: number; y: number; player: Player }) => {
      if (stage !== FIGHTING) throw new Error(`Not a fighting stage`);
      if (player !== getCurrentPlayer())
        throw new Error(`Player ${player} makes move during enemy turn`);
      const allShipsTilesToCheck = player === ALLY ? enemyShips : allyShips;
      const shipShelled = _.find(
        allShipsTilesToCheck,
        (ship) => ship.x === x && ship.y === y
      );
      let isShipDestroyed = false;
      let allShipTiles: ShipType[] = [];
      if (shipShelled) {
        allShipTiles = _.filter(
          allShipsTilesToCheck,
          (ship) => ship.name === shipShelled.name
        );
        isShipDestroyed = allShipTiles.every((shipTile) => {
          //current hit
          if (areXYsEual(shipTile.x, shipTile.y, x, y)) return true;
          //previous hits
          for (let log of gameLog.filter((l) => l.player === player)) {
            if (areXYsEual(shipTile.x, shipTile.y, log.x, log.y)) return true;
          }
          return false;
        });
      }
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
    [stage, getCurrentPlayer, gameLog, enemyShips, allyShips]
  );

  /* ENEMY takes a turn */
  useEffect(() => {
    const takeTurnAI = async () => {
      await delay(500);
      const { x, y } = getAttackTarget({ gameLog: gameLog });
      makeMove({ x, y, player: ENEMY });
    };
    if (getCurrentPlayer() === ENEMY && stage === FIGHTING) takeTurnAI();
  }, [getCurrentPlayer, makeMove, allyShips, gameLog, stage]);
  return (
    <SinglePlayerContext.Provider
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
    </SinglePlayerContext.Provider>
  );
};

export default SinglePlayerProvider;
