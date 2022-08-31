import React, { useContext, useEffect, useReducer } from "react";

import {
  BOT,
  DEFAULT_BORDER,
  ENEMY_SHIP,
  GAME_OVER,
  HUMAN,
  READY,
} from "constants/const";
import { BorderType, TileType } from "SinglePlayer/Board/types";
import {
  areXYsEual,
  generateTiles,
  getAdjacentTiles,
  getAllships,
  getBorder,
  getShipPartByIdx,
} from "utils";
import { GameContext } from "SinglePlayer/context/GameContext";
import { LogEntry, Player } from "SinglePlayer/types";
import { ShipType } from "SinglePlayer/ShipDocks/types";

const initialState = {
  tiles: generateTiles({ enemy: false }) as TileType[],
  enemyTiles: generateTiles({ enemy: true }) as TileType[],
  localGameLog: [] as LogEntry[],
  dockShips: getAllships() as ShipType[],
};

type State = {
  tiles: TileType[];
  enemyTiles: TileType[];
  localGameLog: LogEntry[];
  dockShips: ShipType[];
};
type ActionType =
  | { type: typeof ACTION.DISPOSE_ENEMY; payload: { ships: ShipType[] } }
  | { type: typeof ACTION.AUTO_SET_BOARD; payload: { tiles: TileType[] } }
  | { type: typeof ACTION.RESET_BOARD }
  | {
      type: typeof ACTION.UPDATE_BOARD;
      payload: { x: number; y: number; success: boolean; player: Player }[];
    }
  | { type: typeof ACTION.UPDATE_LOCAL_GAME_LOG; payload: LogEntry[] }
  | {
      type: typeof ACTION.PLACE_SHIP_PART_ON_BOARD;
      payload: { ship: ShipType };
    }
  | {
      type: typeof ACTION.UPDATE_TILES_BORDER;
      payload: { x: number; y: number; border: BorderType };
    };

const ACTION = {
  PLACE_SHIP_PART_ON_BOARD: "place_ship_on_board" as "place_ship_on_board",
  UPDATE_TILES_BORDER: "update_adjacent_tiles" as "update_adjacent_tiles",
  UPDATE_LOCAL_GAME_LOG: "update_local_game_log" as "update_local_game_log",
  UPDATE_BOARD: "shelling_board" as "shelling_board",
  RESET_BOARD: "reset board" as "reset board",
  AUTO_SET_BOARD: "auto set board" as "auto set board",
  DISPOSE_ENEMY: "dispose enemy" as "dispose enemy",
};

const reducer = (state: State, action: ActionType): State | never => {
  switch (action.type) {
    case ACTION.PLACE_SHIP_PART_ON_BOARD:
      return {
        ...state,
        dockShips: state.dockShips.filter(
          (ship) => ship.name !== action.payload.ship.name
        ),
        tiles: state.tiles.map((tile) => {
          if (
            tile.x === action.payload.ship?.x &&
            tile.y === action.payload.ship.y
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
    case ACTION.UPDATE_LOCAL_GAME_LOG:
      return {
        ...state,
        localGameLog: action.payload,
      };
    case ACTION.UPDATE_BOARD:
      const getUpdatedTile = (tile: TileType, ofPlayer: Player) => {
        for (let { x, y, success, player } of action.payload) {
          if (player !== ofPlayer && areXYsEual(tile.x, tile.y, x, y)) {
            tile.shelled = true;
            if (player === HUMAN && success) tile.occupiedBy = ENEMY_SHIP;
          }
        }
        return tile;
      };
      return {
        ...state,
        tiles: state.tiles.map((tile) => getUpdatedTile(tile, HUMAN)),
        enemyTiles: state.enemyTiles.map((tile) => getUpdatedTile(tile, BOT)),
      };

    case ACTION.DISPOSE_ENEMY: {
      return {
        ...state,
        enemyTiles: state.enemyTiles.map((tile) => {
          for (let ship of action.payload.ships) {
            if (areXYsEual(tile.x, tile.y, ship.x, ship.y)) {
              tile.occupiedBy = ship;
            }
          }
          return tile;
        }),
      };
    }
    case ACTION.RESET_BOARD: {
      return {
        ...initialState,
        tiles: generateTiles({ enemy: false }),
        enemyTiles: generateTiles({ enemy: true }),
        dockShips: getAllships(),
      };
    }
    case ACTION.AUTO_SET_BOARD: {
      return {
        ...initialState,
        tiles: action.payload.tiles,
        enemyTiles: generateTiles({ enemy: true }),
        dockShips: [],
      };
    }
    default:
      throw new Error("Invalid action game reducer");
  }
};
export const validShip = (
  occupiedBy: ShipType | null | typeof ENEMY_SHIP
): boolean => {
  return Boolean(occupiedBy && occupiedBy !== ENEMY_SHIP);
};
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

const BoardProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { gameLog, gameStage, getHumansBoardAndStart, winner, disposeEnemy } =
    useContext(GameContext);

  const resetBoard = () => dispatch({ type: ACTION.RESET_BOARD });
  const autoSetBoard = (tiles: TileType[]) =>
    dispatch({ type: ACTION.AUTO_SET_BOARD, payload: { tiles } });

  const checkCanDrop = (ship: ShipType) => {
    const tilesToCheck = getAdjacentTiles(ship, state.tiles);
    return (
      tilesToCheck.findIndex(
        (tile) => tile === null || tile.occupiedBy !== null
      ) === -1
    );
  };
  const updateTilesBorders = ({
    ship,
    hovered,
    canDrop,
  }: UpdateTilesBordersType) => {
    getAdjacentTiles(ship, state.tiles).forEach((tile) => {
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
    const claimedTiles = getAdjacentTiles(ship, state.tiles);
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
    if (gameStage === READY) {
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
      getHumansBoardAndStart(ships);
    }
  }, [gameStage, getHumansBoardAndStart, state.tiles]);

  useEffect(() => {
    if (gameStage === GAME_OVER) {
      const ships = disposeEnemy();
      dispatch({ type: ACTION.DISPOSE_ENEMY, payload: { ships } });
    }
  }, [disposeEnemy, gameStage]);

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
