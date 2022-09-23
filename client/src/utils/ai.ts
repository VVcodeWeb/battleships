import _ from "underscore";

import { TileType } from "Game/Board/types";
import {
  PATROL,
  VERTICAL,
  HORIZONTAL,
  DEFAULT_BORDER,
  PART_0,
  ENEMY,
  COLUMNS,
} from "constants/const";
import {
  ShipNames,
  ShipOrientation,
  Coordinates,
  ShipType,
} from "Game/ShipDocks/types";
import { LogEntry } from "Game/types";
import {
  generateTiles,
  getAllships,
  getTile,
  getTilesForShip,
  getShipPartByIdx,
  getAdjacent,
  getBlockedTiles,
} from "utils";

export const getRandomCoordinate = (): Coordinates => ({
  x: _.random(COLUMNS - 1),
  y: _.random(COLUMNS - 1),
});
export const getRandomOrientation = (name: ShipNames): ShipOrientation => {
  if (name.includes(PATROL)) return VERTICAL;
  return _.random(1) === 0 ? VERTICAL : HORIZONTAL;
};

const shelledBefore = (x: number, y: number, log: LogEntry[]): boolean =>
  Boolean(log.find((l) => l.x === x && l.y === y));

export const getAttackTarget = ({
  gameLog,
}: {
  gameLog: LogEntry[];
}): Coordinates => {
  const shells = gameLog.filter((log) => log.player === ENEMY);
  const hits = shells.filter((shell) => shell.success);
  const suggestions: Coordinates[] = [];
  for (let hit of hits) {
    if (hit.y + 1 < 10) suggestions.push({ x: hit.x, y: hit.y + 1 });
    if (hit.y - 1 > -1) suggestions.push({ x: hit.x, y: hit.y - 1 });
    if (hit.x + 1 < 10) suggestions.push({ x: hit.x + 1, y: hit.y });
    if (hit.x - 1 > -1) suggestions.push({ x: hit.x - 1, y: hit.y });
  }
  let validSuggestions = suggestions.filter(
    (sug) => !shelledBefore(sug.x, sug.y, shells)
  );
  const blockedCoordinates = getBlockedTiles(gameLog, ENEMY);
  validSuggestions = validSuggestions.filter(
    (sug) => !Boolean(_.findWhere(blockedCoordinates, { x: sug.x, y: sug.y }))
  );
  if (validSuggestions.length > 0) {
    //hunt
    return validSuggestions[validSuggestions.length - 1];
  } else {
    //scout
    while (true) {
      const { x, y } = getRandomCoordinate();
      if (
        !shelledBefore(x, y, shells) &&
        !Boolean(_.findWhere(blockedCoordinates, { x, y }))
      )
        return { x, y };
    }
  }
};

export const placeShipOnTemporarBoard = (
  ship: ShipType,
  shipTiles: TileType[],
  tiles: TileType[],
  enemyShips: ShipType[]
) => {
  for (let i = 0; i < shipTiles.length; i++) {
    const dropOnTile = shipTiles[i];
    if (dropOnTile) {
      enemyShips.push({
        x: dropOnTile.x,
        y: dropOnTile.y,
        name: ship.name,
        part: getShipPartByIdx(i),
        orientation: ship.orientation,
        damaged: false,
      });
      tiles.forEach((tile) => {
        if (tile.x === dropOnTile.x && tile.y === dropOnTile.y) {
          tile.occupiedBy = {
            ...ship,
            part: getShipPartByIdx(i),
          };
          tile.border = DEFAULT_BORDER;
        }
      });
    } else throw new Error("Trying to place ship over null tile");
  }
};
export const generateBoardAI = (): {
  enemyShips: ShipType[];
  tiles: TileType[];
} => {
  const tiles = generateTiles({ enemy: false });
  const ships = getAllships();
  const enemyShips: Array<ShipType> = [];
  const invalidCoordinates: Coordinates[] = [];
  let allShipsPlaced = false;
  let breaker = 0;
  while (!allShipsPlaced && breaker < 100) {
    breaker++;
    const { x, y } = getRandomCoordinate();
    if (invalidCoordinates.find((f) => f.x === x && f.y === y)) continue;
    const tile = getTile({ x, y, tiles });
    if (!tile?.occupiedBy) {
      const ship = ships[0];
      if (!ship) return { enemyShips, tiles };
      ship.orientation = getRandomOrientation(ship.name);
      ship.part = PART_0;
      ship.x = x;
      ship.y = y;
      const shipTiles = getTilesForShip(ship, tiles);
      if (shipTiles.length !== _.compact(shipTiles).length) continue;
      const adjacentTiles = getAdjacent(shipTiles as TileType[], tiles);
      const isOccupied = shipTiles.some((tile) => tile?.occupiedBy !== null);
      const isBlocked = adjacentTiles.some((tile) => tile?.occupiedBy !== null);
      if (isOccupied || isBlocked) continue;
      placeShipOnTemporarBoard(
        ship,
        shipTiles as TileType[],
        tiles,
        enemyShips
      );
      ships.shift();
    } else invalidCoordinates.push({ x, y });
  }
  return { enemyShips, tiles };
};
