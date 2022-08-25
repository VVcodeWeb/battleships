import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  NO_DROP_AND_VISIBLE,
  PART_0,
  PART_1,
  PART_2,
  VERTICAL,
} from "constants/const";
import { TileType } from "GameBoard/Tile";
import {
  ACTION,
  ActionType,
  BorderType,
  Coordinates,
  ShipDragData,
  ShipOrientation,
  ShipPart,
  State,
} from "GameBoard/types";
import React, { useEffect, useReducer, useState } from "react";
import { useCallback } from "react";

const initialState = {
  tiles: Array.from(Array(100).keys()).map((tile) => ({
    idx: tile,
    x: tile % 10,
    y: Math.floor(tile / 10),
    occupiedBy: null,
    border: DEFAULT_BORDER,
  })) as Array<TileType>,
};

const reducer = (state: State, action: ActionType): State | never => {
  switch (action.type) {
    case ACTION.PLACE_SHIP_PART_ON_BOARD:
      return {
        ...state,
        tiles: state.tiles.map((tile) => {
          if (
            tile.x === action.payload.shipData.x &&
            tile.y === action.payload.shipData.y
          )
            return {
              ...tile,
              occupiedBy: action.payload.shipData,
            };
          return tile;
        }),
      };
    case ACTION.UPDATE_TILES_BORDER:
      return {
        ...state,
        tiles: state.tiles.map((tile) => {
          if (tile.x === action.payload.x && tile.y === action.payload.y) {
            return {
              ...tile,
              border: action.payload.border,
            };
          }
          return tile;
        }),
      };
    default:
      throw new Error("Invalid action game reducer");
  }
};

type UpdateTilesBordersType = {
  shipData: ShipDragData;
  hovered: boolean;
  canDrop: boolean;
};
export const GameContext = React.createContext({
  ...initialState,
  checkCanDrop: (test: any): any => {},
  placeShipOnBoard: (shipData: ShipDragData) => {},
  updateTilesBorders: ({
    shipData,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {},
});

const getBorder = ({
  hovered,
  canDrop,
}: {
  hovered: boolean;
  canDrop: boolean;
}): BorderType => {
  if (canDrop && hovered) return CAN_DROP_AND_VISIBLE;
  if (!canDrop && hovered) return NO_DROP_AND_VISIBLE;
  return DEFAULT_BORDER;
};

const GameProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateTilesBorders = ({
    shipData,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {
    const adjacentTiles = getAdjacentTiles(shipData);

    adjacentTiles.forEach((tile) => {
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

  const getTilesBehindShipPart = (shipPart: ShipPart) => {
    switch (shipPart) {
      case PART_0:
        return 0;
      case PART_1:
        return 1;
      case PART_2:
        return 2;
      default:
        throw new Error("Invalid ship part");
    }
  };

  const getAdjacentTiles = useCallback(
    (ship: ShipDragData): Array<TileType | null> => {
      const getTile = ({ x, y }: Coordinates): TileType | null => {
        const tile = state.tiles
          .slice()
          .find((tile) => tile.x === x && tile.y === y);
        return tile ?? null;
      };
      const { shipOrientation, shipPart, size, x, y } = ship;
      let itemsLeft = size;
      if (shipOrientation === VERTICAL) {
        const tilesToGet: Array<TileType | null> = [];
        let cursor = -1 * getTilesBehindShipPart(shipPart);
        while (itemsLeft > 0) {
          tilesToGet.push(getTile({ x, y: y - cursor }));
          cursor++;
          itemsLeft--;
        }
        return tilesToGet;
      }
      /* TODO  horizontal orierntation*/
      return [null];
    },
    [state.tiles]
  );
  useEffect(() => {
    console.log({ tiles: state.tiles });
  }, [state.tiles]);
  const checkCanDrop = (ship: ShipDragData) => {
    const getTilesToCheck = getAdjacentTiles(ship);
    console.log({ getTilesToCheck });
    const canDrop =
      getTilesToCheck.findIndex(
        (tile) => tile === null || tile.occupiedBy !== null
      ) === -1;
    return canDrop;
  };

  const placeShipOnBoard = (shipData: ShipDragData) => {
    const claimedTiles = getAdjacentTiles(shipData);
    const getShipPartByIdx = (idx: number): ShipPart => {
      switch (idx) {
        case 0:
          return PART_0;
        case 1:
          return PART_1;
        case 2:
          return PART_2;
        default:
          throw new Error("Invalid index getShipPartByIdx");
      }
    };
    for (let i = 0; i < claimedTiles.length; i++) {
      const tile = claimedTiles[i];
      if (tile)
        dispatch({
          type: ACTION.PLACE_SHIP_PART_ON_BOARD,
          payload: {
            shipData: {
              ...shipData,
              x: tile.x,
              y: tile?.y,
              shipPart: getShipPartByIdx(i),
            },
          },
        });
      else throw new Error("Try to place ship over null tile");
    }
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        updateTilesBorders,
        placeShipOnBoard,
        checkCanDrop,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
