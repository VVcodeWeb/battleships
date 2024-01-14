import _ from "underscore";
import { ClientLogEntry, Player, ServerLogEntry, ShipType } from "./types";
import { MAX_SHIP_PARTS } from "./constants";

export const getMoveResult = ({
  x,
  y,
  player,
  gameLog,
  enemyShips,
}: {
  x: number;
  y: number;
  player: Player | string;
  gameLog: ServerLogEntry[] | ClientLogEntry[];
  enemyShips: ShipType[];
}) => {
  const shelledBefore = gameLog.find(
    (log) => log.x === x && log.y === y && log.player === player
  );
  if (shelledBefore) throw new Error(`Duplicated move `);
  const shipShelled = _.find(
    enemyShips,
    (ship) => ship.x === x && ship.y === y
  );
  let isShipDestroyed = false;
  let allShipTiles: ShipType[] = [];
  if (shipShelled) {
    allShipTiles = _.filter(
      enemyShips,
      (ship) => ship.name === shipShelled.name
    );
    isShipDestroyed = allShipTiles.every((shipTile) => {
      //current hit
      if (areXYsEual(shipTile.x, shipTile.y, x, y)) return true;
      //previous hits
      for (let log of gameLog.filter((l) => l.player === player)) {
        if (areXYsEual(shipTile.x, shipTile.y, log.x, log.y)) return true;
      }
      return false;
    });
  }
  return {
    success: Boolean(shipShelled),
    destroyed: shipShelled && isShipDestroyed ? allShipTiles : null,
  };
};

export const checkIfPlayerWon = ({
  gameLog,
  player,
}: {
  gameLog: ServerLogEntry[] | ClientLogEntry[];
  player: string | Player;
}): boolean => {
  const succeededShells = gameLog.filter(
    (log) => log.player === player && log.success
  );
  return succeededShells.length >= MAX_SHIP_PARTS;
};

export const areXYsEual = (x1: number, y1: number, x2: number, y2: number) =>
  x1 === x2 && y1 === y2;
