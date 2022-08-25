import React, { useReducer, useCallback } from "react";

import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  NO_DROP_AND_VISIBLE,
  VERTICAL,
} from "constants/const";
import {
  ACTION,
  ActionType,
  BorderType,
  State,
  TileType,
} from "GameBoard/types";
import { getShipPartByIdx, getTilesBehindShipPart } from "utils";
import { ShipType, Coordinates } from "ShipDocks/types";

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
        tiles: state.tiles.map((tile) => {
          if (
            tile.x === action.payload.ship.coordinates?.x &&
            tile.y === action.payload.ship.coordinates.y
          )
            return {
              ...tile,
              occupiedBy: action.payload.ship,
              border: DEFAULT_BORDER,
            };
          return tile;
        }),
      };
    case ACTION.UPDATE_TILES_BORDER:
      return {
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
  ship: ShipType;
  hovered: boolean;
  canDrop: boolean;
};
export const GameContext = React.createContext({
  ...initialState,
  checkCanDrop: (test: any): any => {},
  placeShipOnBoard: (ship: ShipType) => {},
  updateTilesBorders: ({
    ship,
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

const GameBoardProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const updateTilesBorders = ({
    ship,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {
    getAdjacentTiles(ship).forEach((tile) => {
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

  const getAdjacentTiles = useCallback(
    (ship: ShipType): Array<TileType | null> => {
      const getTile = ({ x, y }: Coordinates): TileType | null => {
        const tile = state.tiles
          .slice()
          .find((tile) => tile.x === x && tile.y === y);
        return tile ?? null;
      };
      if (ship.coordinates) {
        const { x, y } = ship.coordinates;
        let itemsLeft = ship.size;
        if (ship.orientation === VERTICAL) {
          const tilesToGet: Array<TileType | null> = [];
          let cursor = -1 * getTilesBehindShipPart(ship.dragPart);
          while (itemsLeft > 0) {
            tilesToGet.push(getTile({ x, y: y - cursor }));
            cursor++;
            itemsLeft--;
          }
          return tilesToGet;
        }
        /* TODO  horizontal orierntation*/
      }
      return [null];
    },
    [state.tiles]
  );

  const checkCanDrop = (ship: ShipType) => {
    const tilesToCheck = getAdjacentTiles(ship);
    return (
      tilesToCheck.findIndex(
        (tile) => tile === null || tile.occupiedBy !== null
      ) === -1
    );
  };

  const placeShipOnBoard = (ship: ShipType) => {
    const claimedTiles = getAdjacentTiles(ship);
    for (let i = 0; i < claimedTiles.length; i++) {
      const tile = claimedTiles[i];
      if (tile && ship.coordinates) {
        dispatch({
          type: ACTION.PLACE_SHIP_PART_ON_BOARD,
          payload: {
            ship: {
              ...ship,
              coordinates: {
                x: tile.x,
                y: tile.y,
              },
              dragPart: getShipPartByIdx(i),
              isOnBoard: true,
            },
          },
        });
      } else throw new Error("Try to place ship over null tile");
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

export default GameBoardProvider;
