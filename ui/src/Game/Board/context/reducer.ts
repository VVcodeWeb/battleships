import { DEFAULT_BORDER, ALLY, ENEMY_SHIP, ENEMY } from "shared/constants";
import { TileType, BorderType } from "Game/Board/types";
import { ShipType } from "Game/ShipDocks/types";
import _ from "underscore";
import { generateTiles, getAllships, getBlockedTiles, areXYsEual } from "utils";
import { ClientLogEntry, Player } from "@shared/types";

export const initialState = {
  tiles: generateTiles({ enemy: false }) as TileType[],
  enemyTiles: generateTiles({ enemy: true }) as TileType[],
  localGameLog: [] as ClientLogEntry[],
  dockShips: getAllships() as ShipType[],
};

type State = {
  tiles: TileType[];
  enemyTiles: TileType[];
  localGameLog: ClientLogEntry[];
  dockShips: ShipType[];
};
type ActionType =
  | { type: typeof ACTION.DISPOSE_ENEMY; payload: { ships: ShipType[] } }
  | { type: typeof ACTION.AUTO_SET_BOARD; payload: { tiles: TileType[] } }
  | { type: typeof ACTION.RESET_BOARD }
  | {
      type: typeof ACTION.UPDATE_BOARD;
      payload: ClientLogEntry[];
    }
  | {
      type: typeof ACTION.PLACE_SHIP_PART_ON_BOARD;
      payload: { ship: ShipType };
    }
  | {
      type: typeof ACTION.UPDATE_TILES_BORDER;
      payload: { x: number; y: number; border: BorderType };
    };

export const ACTION = {
  PLACE_SHIP_PART_ON_BOARD: "place_ship_on_board" as "place_ship_on_board",
  UPDATE_TILES_BORDER: "update_adjacent_tiles" as "update_adjacent_tiles",
  UPDATE_LOCAL_GAME_LOG: "update_local_game_log" as "update_local_game_log",
  UPDATE_BOARD: "shelling_board" as "shelling_board",
  RESET_BOARD: "reset board" as "reset board",
  AUTO_SET_BOARD: "auto set board" as "auto set board",
  DISPOSE_ENEMY: "dispose enemy" as "dispose enemy",
};

export const reducer = (state: State, action: ActionType): State | never => {
  switch (action.type) {
    case ACTION.PLACE_SHIP_PART_ON_BOARD:
      const { ship } = action.payload;
      return {
        ...state,
        dockShips: state.dockShips.filter(
          (dockShip) => dockShip.name !== ship.name
        ),
        tiles: state.tiles.map((tile) => {
          if (tile.x === ship?.x && tile.y === ship.y)
            return {
              ...tile,
              occupiedBy: ship,
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

    case ACTION.UPDATE_BOARD:
      const gameLog = action.payload;
      const blockedCoordinates = getBlockedTiles(gameLog, ALLY);
      const getUpdatedTile = (tile: TileType, ofPlayer: Player) => {
        for (let { x, y, success, player } of gameLog) {
          if (player !== ofPlayer && areXYsEual(tile.x, tile.y, x, y)) {
            tile.shelled = true;
            if (player === ALLY && success) tile.occupiedBy = ENEMY_SHIP;
          }
          if (
            ofPlayer !== ALLY &&
            _.findWhere(blockedCoordinates, { x: tile.x, y: tile.y })
          )
            tile.blocked = true;
        }
        return tile;
      };
      return {
        ...state,
        tiles: state.tiles.map((tile) => getUpdatedTile(tile, ALLY)),
        enemyTiles: state.enemyTiles.map((tile) => getUpdatedTile(tile, ENEMY)),
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
