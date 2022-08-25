import { ShipNames, ShipOnBoardType } from "components/types";
import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  HORIZONTAL,
  NO_DROP_AND_VISIBLE,
  PART_0,
  PART_1,
  PART_2,
  VERTICAL,
} from "constants/const";
import { TileType } from "GameBoard/Tile";

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
      payload: { shipData: ShipDragData };
    }
  | {
      type: typeof ACTION.UPDATE_TILES_BORDER;
      payload: { x: number; y: number; border: BorderType };
    };

export type State = {
  tiles: Array<TileType>;
};
export type ShipPart = null | typeof PART_0 | typeof PART_1 | typeof PART_2;
export type ShipOrientation = typeof VERTICAL | typeof HORIZONTAL;

export interface Coordinates {
  x: number;
  y: number;
}
export interface ShipDragData extends Coordinates {
  name: ShipNames;
  size: number;
  shipPart: ShipPart;
  shipOrientation: ShipOrientation;
}
