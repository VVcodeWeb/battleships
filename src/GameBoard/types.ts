import { ShipType } from "ShipDocks/types";
import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  NO_DROP_AND_VISIBLE,
} from "constants/const";
export type TileType = {
  idx: number;
  x: number;
  y: number;
  occupiedBy: ShipType | null;
  border:
    | typeof DEFAULT_BORDER
    | typeof CAN_DROP_AND_VISIBLE
    | typeof NO_DROP_AND_VISIBLE;
};
export const ACTION = {
  PLACE_SHIP_PART_ON_BOARD: "place_ship_on_board" as "place_ship_on_board",
  UPDATE_TILES_BORDER: "update_adjacent_tiles" as "update_adjacent_tiles",
};

export type BorderType =
  | typeof CAN_DROP_AND_VISIBLE
  | typeof NO_DROP_AND_VISIBLE
  | typeof DEFAULT_BORDER;
export type ActionType =
  | {
      type: typeof ACTION.PLACE_SHIP_PART_ON_BOARD;
      payload: { ship: ShipType };
    }
  | {
      type: typeof ACTION.UPDATE_TILES_BORDER;
      payload: { x: number; y: number; border: BorderType };
    };

export type State = {
  tiles: Array<TileType>;
};
