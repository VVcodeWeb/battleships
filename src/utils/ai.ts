import { TileType } from "Board/types";
import {
  PATROL,
  VERTICAL,
  HORIZONTAL,
  DEFAULT_BORDER,
  PART_0,
  MAX_SHIPS,
  BOT,
} from "constants/const";
import {
  ShipNames,
  ShipOrientation,
  Coordinates,
  ShipType,
} from "ShipDocks/types";
import { LogEntry } from "SinglePlayer/types";
import {
  getRandomNumber,
  generateTiles,
  getAllships,
  getRandomCoordinate,
  getTile,
  getAdjacentTiles,
  getShipPartByIdx,
} from "utils";

export const getRandomOrientation = (name: ShipNames): ShipOrientation => {
  if (name.includes(PATROL)) return VERTICAL;
  return getRandomNumber(0, 1) === 0 ? VERTICAL : HORIZONTAL;
};

export const placeShipOnTemporarBoard = (
  ship: ShipType,
  adjacentTiles: Array<TileType | null>,
  tiles: TileType[],
  enemyShips: ShipType[]
) => {
  for (let i = 0; i < adjacentTiles.length; i++) {
    const dropOnTile = adjacentTiles[i];
    console.log({ dropOnTile });
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
const shelledBefore = (x: number, y: number, log: LogEntry[]): boolean =>
  Boolean(log.find((l) => l.x === x && l.y === y));

export const takeTurnAI = ({
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
  while (!allShipsPlaced && breaker < 200) {
    const { x, y } = getRandomCoordinate();
    if (!invalidCoordinates.find((f) => f.x === x && f.y === y)) {
      const tile = getTile({ x, y, tiles });
      if (!tile?.occupiedBy) {
        const ship = ships[0];
        if (!ship) return { enemyShips, tiles };

        ship.orientation = getRandomOrientation(ship.name);
        ship.part = PART_0;
        ship.x = x;
        ship.y = y;
        const adjacentTiles = getAdjacentTiles(ship, tiles);
        const canPlace =
          adjacentTiles.findIndex(
            (tile) => tile === null || tile.occupiedBy !== null
          ) === -1;
        if (canPlace) {
          placeShipOnTemporarBoard(ship, adjacentTiles, tiles, enemyShips);
          ships.shift();
        } else invalidCoordinates.push({ x, y });
        if (enemyShips.length === MAX_SHIPS) allShipsPlaced = true;
      }
    }

    breaker++;
  }
  if (enemyShips.length < MAX_SHIPS)
    throw new Error("Not enough ships placed by AI");
  return { enemyShips, tiles };
};
