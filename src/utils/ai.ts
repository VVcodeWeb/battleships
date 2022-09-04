import { TileType } from "SinglePlayer/Board/types";
import {
  PATROL,
  VERTICAL,
  HORIZONTAL,
  DEFAULT_BORDER,
  PART_0,
  MAX_SHIPS,
  BOT,
  COLUMNS,
} from "constants/const";
import {
  ShipNames,
  ShipOrientation,
  Coordinates,
  ShipType,
} from "SinglePlayer/ShipDocks/types";
import { LogEntry } from "SinglePlayer/types";
import {
  generateTiles,
  getAllships,
  getTile,
  getTilesForShip,
  getShipPartByIdx,
  getAdjacent,
  removeNullElements,
} from "utils";

export const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomCoordinate = (): Coordinates => ({
  x: getRandomNumber(0, COLUMNS - 1),
  y: getRandomNumber(0, COLUMNS - 1),
});
export const getRandomOrientation = (name: ShipNames): ShipOrientation => {
  if (name.includes(PATROL)) return VERTICAL;
  return getRandomNumber(0, 1) === 0 ? VERTICAL : HORIZONTAL;
};

const shelledBefore = (x: number, y: number, log: LogEntry[]): boolean =>
  Boolean(log.find((l) => l.x === x && l.y === y));

export const getAttackTarget = ({
  gameLog,
}: {
  gameLog: LogEntry[];
}): Coordinates => {
  const shells = gameLog.filter((log) => log.player === BOT);
  const hits = shells.filter((shell) => shell.success);
  const suggestions: Coordinates[] = [];
  for (let hit of hits) {
    suggestions.push({ x: hit.x, y: hit.y + 1 });
    suggestions.push({ x: hit.x, y: hit.y - 1 });
    suggestions.push({ x: hit.x + 1, y: hit.y });
    suggestions.push({ x: hit.x - 1, y: hit.y });
  }
  const validSuggestions = suggestions.filter(
    (sug) => !shelledBefore(sug.x, sug.y, shells)
  );
  if (validSuggestions.length > 0) {
    //hunt
    return validSuggestions[validSuggestions.length - 1];
  } else {
    //scout
    while (true) {
      const { x, y } = getRandomCoordinate();
      if (!shelledBefore(x, y, shells)) return { x, y };
    }
  }
};

//todo: add blocking
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
    } else throw new Error("Try to place ship over null tile");
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
      if (shipTiles.length !== removeNullElements(shipTiles).length) continue;
      const adjacentTiles = getAdjacent(shipTiles as TileType[], tiles);
      const isOccupied = shipTiles.some((t) => t?.occupiedBy !== null);
      const isBlocked = adjacentTiles.some((t) => t?.occupiedBy !== null);
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
