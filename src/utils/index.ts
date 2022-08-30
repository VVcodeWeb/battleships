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

export const getSize = (ship: ShipType): number => {
  const name = ship.name;
  const n = name.toLowerCase();
  if (n === BATTLESHIP) return 5;
  if (n === FRIGATE) return 4;
  if (n === CARAVELA) return 3;
  if (n.includes(DROMON)) return 2;
  if (n.includes(PATROL)) return 1;
  throw new Error(`Invalid ship name ${ship.name}`);
};
export const getAllships = (): ShipType[] => {
  const fleet: ShipType[] = [];

  const buildShip = (name: ShipNames): ShipType => ({
    name,
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
export const generateTiles = ({ enemy }: { enemy: boolean }): TileType[] => {
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
  tiles: TileType[];
}): TileType | null =>
  tiles.slice().find((tile) => tile.x === x && tile.y === y) ?? null;

export const getAdjacentTiles = (
  ship: ShipType,
  tiles: TileType[]
): Array<TileType | null> => {
  if (ship.coordinates && ship.dragPart) {
    const { x, y } = ship.coordinates;
    let itemsLeft = getSize(ship);

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

export const areXYsEual = (x1: number, y1: number, x2: number, y2: number) =>
  x1 === x2 && y1 === y2;

export const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomCoordinate = (): Coordinates => ({
  x: getRandomNumber(0, 9),
  y: getRandomNumber(0, 9),
});
