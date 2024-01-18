import {
  BATTLESHIP,
  PATROL_BOAT_A,
  PATROL_BOAT_B,
  HORIZONTAL,
  PART_0,
  PART_1,
  PART_2,
  VERTICAL,
  FRIGATE,
  CARAVELA,
  DROMON_A,
  DROMON_B,
  PART_3,
  PART_4,
} from "shared/constants";

export type ShipNames =
  | typeof BATTLESHIP
  | typeof FRIGATE
  | typeof CARAVELA
  | typeof DROMON_A
  | typeof DROMON_B
  | typeof PATROL_BOAT_A
  | typeof PATROL_BOAT_B;
export interface Coordinates {
  x: number;
  y: number;
}
export type ShipPartType =
  | null
  | typeof PART_0
  | typeof PART_1
  | typeof PART_2
  | typeof PART_3
  | typeof PART_4;
export type ShipOrientation = typeof VERTICAL | typeof HORIZONTAL;
export type ShipType = {
  x: number;
  y: number;
  damaged: boolean;
  name: ShipNames;
  part: ShipPartType;
  orientation: ShipOrientation;
};
