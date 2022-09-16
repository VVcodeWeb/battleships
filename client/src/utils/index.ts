import {
  Coordinates,
  ShipNames,
  ShipPartType,
  ShipType,
} from "Game/ShipDocks/types";
import {
  BATTLESHIP,
  CARAVELA,
  COLUMNS,
  DEFAULT_BORDER,
  DROMON,
  DROMON_A,
  DROMON_B,
  FRIGATE,
  NOT_ON_BOARD,
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
import { TileType } from "Game/Board/types";
import { LogEntry, Player } from "Game/types";

export const getSize = (ship: ShipType | ShipNames): number => {
  let name = "";
  if (typeof ship === "string") name = ship;
  else name = ship.name;
  const n = name.toLowerCase();
  if (n === BATTLESHIP) return 5;
  if (n === FRIGATE) return 4;
  if (n === CARAVELA) return 3;
  if (n.includes(DROMON)) return 2;
  if (n.includes(PATROL)) return 1;
  throw new Error(`Invalid ship name ${ship}`);
};
export const getAllships = (): ShipType[] => {
  const fleet: ShipType[] = [];

  const buildShip = (name: ShipNames): ShipType => ({
    name,
    orientation: VERTICAL,
    part: null,
    damaged: false,
    x: NOT_ON_BOARD,
    y: NOT_ON_BOARD,
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

const getTilesBehindShipPart = (shipPart: ShipPartType): number => {
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
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
export const getTile = ({
  x,
  y,
  tiles,
}: {
  x: number;
  y: number;
  tiles: TileType[];
}): TileType | null => {
  const tile = tiles.find((tile) => tile.x === x && tile.y === y) ?? null;
  return tile;
};

const getXYByIdx = (idx: number): { x: number; y: number } => {
  if (idx > 99) return { x: -1, y: -1 };
  const x = idx % 10;
  const y = idx < 10 ? 0 : Math.floor(idx / 10);
  return { x, y };
};

const getIdxByXY = (x: number, y: number): number => y * COLUMNS + x;
export const getTileByIdx = (idx: number, tiles: TileType[]) => {
  if (idx > 99) return null;
  const { x, y } = getXYByIdx(idx);
  const tile = getTile({ x, y, tiles });
  return tile;
};
/**
 * @return returns all non-null adjecent tiles. Doesnt include tiles from tiles array
 */
export const getAdjacent = (
  tiles: TileType[],
  allTiles: TileType[]
): TileType[] => {
  const adjacentTiles: Array<TileType> = [];
  const cursors = [COLUMNS + 1, COLUMNS - 1, COLUMNS, 1];
  for (let { x, y } of tiles) {
    const idx = getIdxByXY(x, y);
    for (let cursor of cursors) {
      const firstTile = getTileByIdx(idx + cursor, allTiles);
      if (firstTile && !tiles.some((t) => areTilesEqual(t, firstTile)))
        adjacentTiles.push(firstTile as TileType);
      const secondTile = getTileByIdx(idx - cursor, allTiles);
      if (secondTile && !tiles.some((t) => areTilesEqual(t, secondTile)))
        adjacentTiles.push(secondTile as TileType);
    }
  }
  return adjacentTiles;
};

/**
 * @return every single tile, even if its null
 */
export const getTilesForShip = (
  ship: ShipType,
  tiles: TileType[]
): (TileType | null)[] => {
  const { x, y } = ship;
  let itemsLeft = getSize(ship);
  const tilesToGet: (TileType | null)[] = [];
  let cursor = -1 * getTilesBehindShipPart(ship.part);
  while (itemsLeft > 0) {
    if (ship.orientation === VERTICAL)
      tilesToGet.push(getTile({ x, y: y - cursor, tiles }));
    else tilesToGet.push(getTile({ x: x - cursor, y, tiles }));
    cursor++;
    itemsLeft--;
  }
  return tilesToGet;
};

const isValidCursor = (cursor: number, x: number) => {
  const allowedCursors0 = [10, -10, 1, -9, 11];
  const allowedCursors9 = [10, -10, -1, 9, -11];
  if (x !== 0 && x !== 9) return true;
  if (allowedCursors0.includes(cursor) && x === 0) return true;
  if (allowedCursors9.includes(cursor) && x === 9) return true;
  return false;
};
export const getAdjacentCoordinates = (
  coordinates: Coordinates[]
): Coordinates[] => {
  const adjacentTiles: Coordinates[] = [];
  const cursors = [1, 9, 10, 11];
  for (let { x, y } of coordinates) {
    const idx = getIdxByXY(x, y);
    for (let cursor of cursors) {
      if (isValidCursor(cursor, x)) {
        const xyOne = getXYByIdx(idx + cursor);
        if (!coordinates.some((c) => areXYsEual(c.x, c.y, xyOne.x, xyOne.y)))
          adjacentTiles.push(xyOne);
      }
      if (isValidCursor(-cursor, x)) {
        const xyTwo = getXYByIdx(idx - cursor);
        if (!coordinates.some((c) => areXYsEual(c.x, c.y, xyTwo.x, xyTwo.y)))
          adjacentTiles.push(xyTwo);
      }
    }
  }
  return adjacentTiles;
};
export const getBlockedTiles = (
  gameLog: LogEntry[],
  forPlayer: Player
): Coordinates[] => {
  const playerShellsLogs = gameLog.filter((log) => log.player === forPlayer);
  const destroyedEnemyLogs = playerShellsLogs.filter((log) => log.destroyed);
  const adjacentBlockedTiles: Coordinates[] = [];
  destroyedEnemyLogs.forEach((log) => {
    if (!log.destroyed) throw new Error("invalid ship name");
    const allShipXY = log.destroyed.map((ship) => ({ x: ship.x, y: ship.y }));
    const blockedCoordinates = getAdjacentCoordinates(allShipXY);
    adjacentBlockedTiles.push(...blockedCoordinates);
  });

  return adjacentBlockedTiles;
};

export const areXYsEual = (x1: number, y1: number, x2: number, y2: number) =>
  x1 === x2 && y1 === y2;

export const areTilesEqual = (fTile: TileType, sTile: TileType) =>
  areXYsEual(fTile.x, fTile.y, sTile.x, sTile.y);

//TODO: replace with underscore js function
export const removeNullElements = <T>(arr: (T | null)[]) =>
  arr.filter((arr) => arr !== null) as T[];
