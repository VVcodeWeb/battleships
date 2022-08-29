import {
  Coordinates,
  ShipNames,
  ShipPartType,
  ShipType,
} from "ShipDocks/types";
import {
  BATTLESHIP,
  CAN_DROP_AND_VISIBLE,
  CARAVELA,
  DEFAULT_BORDER,
  DROMON,
  DROMON_A,
  DROMON_B,
  FRIGATE,
  NO_DROP_AND_VISIBLE,
  PART_0,
  PART_1,
  PART_2,
  PART_3,
  PART_4,
  PATROL,
  PATROL_BOAT_A,
  PATROL_BOAT_B,
  VERTICAL,
} from "constants/const";
import { BorderType, TileType } from "Board/types";

/* import patrolImg from "components/../../public/ships/patrol.png";
import dromon0Img from "components/../../public/ships/dromon_0.png";
import dromon1Img from "components/../../public/ships/dromon_1.png";

import caravela0Img from "components/../../public/ships/caravela_0.png";
import caravela1Img from "components/../../public/ships/caravela_1.png";
import caravela2Img from "components/../../public/ships/caravela_2.png";

import frigate0Img from "components/../../public/ships/frigate_0.png";
import frigate1Img from "components/../../public/ships/frigate_1.png";
import frigate2Img from "components/../../public/ships/frigate_2.png";
import frigate3Img from "components/../../public/ships/frigate_3.png";

import battleship0Img from "components/../../public/ships/battleship/battleship_0.png";
import battleship1Img from "components/../../public/ships/battleship/battleship_1.png";
import battleship2Img from "components/../../public/ships/battleship/battleship_2.png";
import battleship3Img from "components/../../public/ships/battleship/battleship_3.png";
import battleship4Img from "components/../../public/ships/battleship/battleship_4.png"; */

export const getAllships = (): ShipType[] => {
  const fleet: ShipType[] = [];
  const getSize = (name: ShipNames): number => {
    const n = name.toLowerCase();
    if (n === BATTLESHIP) return 5;
    if (n === FRIGATE) return 4;
    if (n === CARAVELA) return 3;
    if (n.includes(DROMON)) return 2;
    return 1;
  };
  const buildShip = (name: ShipNames): ShipType => ({
    name,
    size: getSize(name),
    orientation: VERTICAL,
    dragPart: null,
    isOnBoard: false,
  });
  fleet.push(buildShip(BATTLESHIP));
  fleet.push(buildShip(FRIGATE));
  fleet.push(buildShip(CARAVELA));
  fleet.push(buildShip(DROMON_A));
  fleet.push(buildShip(DROMON_B));
  fleet.push(buildShip(PATROL_BOAT_A));
  fleet.push(buildShip(PATROL_BOAT_B));

  return fleet;
};
export const getShipPartByIdx = (idx: number): ShipPartType => {
  switch (idx) {
    case 0:
      return PART_0;
    case 1:
      return PART_1;
    case 2:
      return PART_2;
    case 3:
      return PART_3;
    case 4:
      return PART_4;
    default:
      throw new Error("Invalid index getShipPartByIdx");
  }
};

export const getTilesBehindShipPart = (shipPart: ShipPartType): number => {
  switch (shipPart) {
    case PART_0:
      return 0;
    case PART_1:
      return 1;
    case PART_2:
      return 2;
    case PART_3:
      return 3;
    case PART_4:
      return 4;
    default:
      throw new Error(`Invalid ship part: ${shipPart}`);
  }
};
export const generateTiles = ({
  enemy,
}: {
  enemy: boolean;
}): Array<TileType> => {
  return Array.from(Array(100).keys()).map((tile) => ({
    idx: tile,
    x: tile % 10,
    y: Math.floor(tile / 10),
    occupiedBy: null,
    border: DEFAULT_BORDER,
    enemy,
    shelled: false,
  }));
};

export const getTile = ({
  x,
  y,
  tiles,
}: {
  x: number;
  y: number;
  tiles: Array<TileType>;
}): TileType | null =>
  tiles.slice().find((tile) => tile.x === x && tile.y === y) ?? null;

export const getAdjacentTiles = (
  ship: ShipType,
  tiles: Array<TileType>
): Array<TileType | null> => {
  if (ship.coordinates && ship.dragPart) {
    const { x, y } = ship.coordinates;
    let itemsLeft = ship.size;

    const tilesToGet: Array<TileType | null> = [];
    let cursor = -1 * getTilesBehindShipPart(ship.dragPart);
    while (itemsLeft > 0) {
      if (ship.orientation === VERTICAL)
        tilesToGet.push(getTile({ x, y: y - cursor, tiles }));
      else tilesToGet.push(getTile({ x: x - cursor, y, tiles }));
      cursor++;
      itemsLeft--;
    }
    return tilesToGet;
  }
  return [null];
};
export const getBorder = ({
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

export const areXYsEual = (x1: number, x2: number, y1: number, y2: number) =>
  x1 === x2 && y1 === y2;

export const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomCoordinate = (): Coordinates => ({
  x: getRandomNumber(0, 9),
  y: getRandomNumber(0, 9),
});
/* export const getImage = (idx: number, name: ShipNames) => {
  const part = getShipPartByIdx(idx);
  if (name.includes(PATROL)) return patrolImg;
  if (name.includes(DROMON)) {
    if (part === PART_0) return dromon0Img;
    if (part === PART_1) return dromon1Img;
    throw new Error("Invalid dromon size");
  }
  if (name === CARAVELA) {
    if (part === PART_0) return caravela0Img;
    if (part === PART_1) return caravela1Img;
    if (part === PART_2) return caravela2Img;
    throw new Error("Invalid caravela size");
  }
  if (name === FRIGATE) {
    if (part === PART_0) return frigate0Img;
    if (part === PART_1) return frigate1Img;
    if (part === PART_2) return frigate2Img;
    if (part === PART_3) return frigate3Img;
    throw new Error("Invalid frigate size");
  }
  if (name === BATTLESHIP) {
    if (part === PART_0) return battleship0Img;
    if (part === PART_1) return battleship1Img;
    if (part === PART_2) return battleship2Img;
    if (part === PART_3) return battleship3Img;
    if (part === PART_4) return battleship4Img;
    throw new Error("Invalid battleship size");
  }
}; */
