import { TileType } from "Board/types";
import {
  PATROL,
  VERTICAL,
  HORIZONTAL,
  DEFAULT_BORDER,
  PART_0,
  MAX_SHIPS,
} from "constants/const";
import {
  ShipNames,
  ShipOrientation,
  ShipType,
  Coordinates,
} from "ShipDocks/types";
import { ShipOnBoardAI } from "SinglePlayer/types";
import {
  getRandomNumber,
  generateTiles,
  getAllships,
  getRandomCoordinate,
  getTile,
  getAdjacentTiles,
} from "utils";

export const getRandomOrientation = (name: ShipNames): ShipOrientation => {
  if (name.includes(PATROL)) return VERTICAL;
  return getRandomNumber(0, 1) === 0 ? VERTICAL : HORIZONTAL;
};

export const placeShipOnBoard = (
  ship: ShipType,
  adjacentTiles: Array<TileType | null>,
  tiles: TileType[],
  shipsOnBoardAI: ShipOnBoardAI[]
) => {
  for (let i = 0; i < adjacentTiles.length; i++) {
    const dropOnTile = adjacentTiles[i];
    if (dropOnTile && ship.coordinates) {
      shipsOnBoardAI.push({
        x: dropOnTile.x,
        y: dropOnTile.y,
        damaged: false,
        name: ship.name,
      });
      tiles.forEach((tile) => {
        if (tile.x === dropOnTile.x && tile.y === dropOnTile.y) {
          tile.occupiedBy = ship;
          tile.border = DEFAULT_BORDER;
        }
      });
    } else throw new Error("Try to place ship over null tile");
  }
};
export const generateBoardAI = (): ShipOnBoardAI[] => {
  const tiles = generateTiles({ enemy: false });
  const ships = getAllships();
  const shipsOnBoardAI: Array<ShipOnBoardAI> = [];
  let allShipsPlaced = false;
  const invalidCoordinates: Coordinates[] = [];
  let breaker = 0;
  while (!allShipsPlaced && breaker < 200) {
    const { x, y } = getRandomCoordinate();
    if (!invalidCoordinates.find((f) => f.x === x && f.y === y)) {
      const tile = getTile({ x, y, tiles });
      if (!tile?.occupiedBy) {
        const ship = ships[0];
        if (!ship) return shipsOnBoardAI;

        ship.orientation = getRandomOrientation(ship.name);
        ship.dragPart = PART_0;
        ship.coordinates = { x, y };
        const adjacentTiles = getAdjacentTiles(ship, tiles);
        const canPlace =
          adjacentTiles.findIndex(
            (tile) => tile === null || tile.occupiedBy !== null
          ) === -1;
        if (canPlace) {
          ship.isOnBoard = true;
          placeShipOnBoard(ship, adjacentTiles, tiles, shipsOnBoardAI);
          ships.shift();
        } else invalidCoordinates.push({ x, y });
        if (shipsOnBoardAI.length === MAX_SHIPS) allShipsPlaced = true;
      }
    }

    breaker++;
  }
  if (shipsOnBoardAI.length < MAX_SHIPS)
    throw new Error("Not enough ships placed by AI");
  return shipsOnBoardAI;
};
