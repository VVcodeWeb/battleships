import {
  CARRIER,
  BATTLESHIP,
  DESTROYER,
  SUBMARINE_A,
  SUBMARINE_B,
  PATROL_BOAT_A,
  PATROL_BOAT_B,
} from "constants/const";
import { ShipOrientation, ShipPart } from "GameBoard/types";

export type ShipNames =
  | typeof CARRIER
  | typeof BATTLESHIP
  | typeof DESTROYER
  | typeof SUBMARINE_A
  | typeof SUBMARINE_B
  | typeof PATROL_BOAT_A
  | typeof PATROL_BOAT_B;
export interface ShipsTypes {
  name: ShipNames;
  size: number;
}

export interface ShipOnBoardType extends ShipsTypes {
  shipPart: ShipPart;
  shipOrientation: ShipOrientation;
}
