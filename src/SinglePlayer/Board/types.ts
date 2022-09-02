import { ShipType } from "SinglePlayer/ShipDocks/types";
import {
  CAN_DROP_AND_VISIBLE,
  DEFAULT_BORDER,
  ENEMY_SHIP,
  NO_DROP_AND_VISIBLE,
} from "constants/const";
export type TileType = {
  x: number;
  y: number;
  enemy: boolean;
  shelled: boolean;
  blocked?: boolean;
  occupiedBy: ShipType | null | typeof ENEMY_SHIP;
  border: BorderType;
};

export type BorderType =
  | typeof CAN_DROP_AND_VISIBLE
  | typeof NO_DROP_AND_VISIBLE
  | typeof DEFAULT_BORDER;
