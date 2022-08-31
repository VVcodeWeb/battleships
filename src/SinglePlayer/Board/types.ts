import { ShipType } from "SinglePlayer/ShipDocks/types";
import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  ENEMY_SHIP,
  NO_DROP_AND_VISIBLE,
} from "constants/const";
export type TileType = {
  idx: number;
  x: number;
  y: number;
  enemy: boolean;
  shelled: boolean;
  occupiedBy: ShipType | null | typeof ENEMY_SHIP;
  border:
    | typeof DEFAULT_BORDER
    | typeof CAN_DROP_AND_VISIBLE
    | typeof NO_DROP_AND_VISIBLE;
};

export type BorderType =
  | typeof CAN_DROP_AND_VISIBLE
  | typeof NO_DROP_AND_VISIBLE
  | typeof DEFAULT_BORDER;
