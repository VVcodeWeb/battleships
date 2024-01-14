import React, { useEffect, useReducer } from "react";
import _ from "underscore";

import { ENEMY_SHIP } from "shared/constants";
import { TileType } from "Game/Board/types";
import { getTilesForShip, getShipPartByIdx, getAdjacent } from "utils";
import { ShipType } from "Game/ShipDocks/types";
import { getBorder } from "Game/Board/utils";
import useGetGameContext from "Game/hooks/useGetGameContext";
import { ACTION, initialState, reducer } from "Game/Board/context/reducer";
import { READY, GAME_OVER } from "shared/constants";

type UpdateTilesBordersType = {
  ship: ShipType;
  hovered: boolean;
  canDrop: boolean;
};
export const BoardContext = React.createContext({
  ...initialState,
  checkCanDrop: (test: any): any => {},
  placeShipOnBoard: (ship: ShipType) => {},
  resetBoard: () => {},
  autoSetBoard: (tiles: TileType[]) => {},
  updateTilesBorders: ({
    ship,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {},
});

/**
 * Game logic of the board
 */
const BoardProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { gameLog, stage, finishPlanning, winner, disposeEnemy } =
    useGetGameContext();

  const resetBoard = () => dispatch({ type: ACTION.RESET_BOARD });
  const autoSetBoard = (tiles: TileType[]) =>
    dispatch({ type: ACTION.AUTO_SET_BOARD, payload: { tiles } });

  const checkCanDrop = (ship: ShipType): Boolean => {
    const tilesToCheck = getTilesForShip(ship, state.tiles);
    if (tilesToCheck.length !== _.compact(tilesToCheck).length) return false;
    const isOccupied = tilesToCheck.some((t) => t?.occupiedBy !== null);
    if (isOccupied) return false;
    const adjacentTiles = getAdjacent(_.compact(tilesToCheck), state.tiles);
    const isBlocked = adjacentTiles.some((t) => t?.occupiedBy !== null);
    return !isBlocked;
  };

  const updateTilesBorders = ({
    ship,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {
    getTilesForShip(ship, state.tiles).forEach((tile) => {
      if (tile) {
        dispatch({
          type: ACTION.UPDATE_TILES_BORDER,
          payload: {
            border: getBorder({ hovered, canDrop }),
            x: tile.x,
            y: tile.y,
          },
        });
      }
    });
  };
  const placeShipOnBoard = (ship: ShipType) => {
    const claimedTiles = getTilesForShip(ship, state.tiles);
    for (let i = 0; i < claimedTiles.length; i++) {
      const tile = claimedTiles[i];
      if (tile) {
        dispatch({
          type: ACTION.PLACE_SHIP_PART_ON_BOARD,
          payload: {
            ship: {
              ...ship,
              x: tile.x,
              y: tile.y,
              part: getShipPartByIdx(i),
            },
          },
        });
      } else throw new Error("Try to place ship over null tile");
    }
  };

  /* new game */
  useEffect(() => (winner === null ? resetBoard() : undefined), [winner]);

  /* returns ships positions from the board upwards  */
  useEffect(() => {
    if (stage === READY) {
      const ships = state.tiles
        .filter((tile) => tile.occupiedBy)
        .map((tile) => {
          if (!tile.occupiedBy || tile.occupiedBy === ENEMY_SHIP)
            throw new Error(`Tile on our board is occupiedBy enemy ship`);
          return {
            x: tile.x,
            y: tile.y,
            damaged: false,
            name: tile.occupiedBy.name,
            orientation: tile.occupiedBy.orientation,
            part: tile.occupiedBy.part,
          };
        });
      finishPlanning(ships);
    }
  }, [stage, finishPlanning, state.tiles]);

  useEffect(() => {
    if (stage === GAME_OVER) {
      const ships = disposeEnemy();
      dispatch({ type: ACTION.DISPOSE_ENEMY, payload: { ships } });
    }
  }, [disposeEnemy, stage]);

  useEffect(() => {
    gameLog.length > 0 &&
      dispatch({ type: ACTION.UPDATE_BOARD, payload: gameLog });
  }, [gameLog]);

  return (
    <BoardContext.Provider
      value={{
        ...state,
        updateTilesBorders,
        placeShipOnBoard,
        checkCanDrop,
        resetBoard,
        autoSetBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export default BoardProvider;
