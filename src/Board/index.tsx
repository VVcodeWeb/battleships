import Grid2 from "@mui/material/Unstable_Grid2";
import { BoardContext } from "Board/context/BoardContext";

import Tile from "Board/Tile";
import { useContext, useEffect } from "react";
import { Coordinates } from "ShipDocks/types";
import { GameContext } from "SinglePlayer/context/useGameContext";

const Board = ({ enemy }: { enemy?: boolean }) => {
  const { tiles, enemyTiles } = useContext(BoardContext);
  const { shipsOnBoardAI } = useContext(GameContext);
  /*   useEffect(() => {
    console.log("TESTING UNIQUENNES");
    let unique: Coordinates[] = [];
    for (let ship of shipsOnBoardAI) {
      if (unique.find((f: any) => f.x === ship.x && f.y === ship.y)) {
        console.log("NOT UNIQUE SHIP");
        console.log(ship);
      }
      unique.push({ x: ship.x, y: ship.y });
    }
  }, [shipsOnBoardAI]); */

  const occupiedByAI = (tile: any, ships: any) => {
    for (let ship of ships) {
      if (ship.x === tile.x && ship.y === tile.y) return true;
    }
    return false;
  };
  useEffect(() => {
    console.log({ enemyTiles });
  }, [enemyTiles]);
  useEffect(() => {
    console.log({ tiles });
  }, [tiles]);
  if (enemy) {
    return (
      <Grid2 container columns={{ xs: 10 }} style={{ width: 600, padding: 0 }}>
        {enemyTiles.map((tile) => (
          <Tile
            key={tile.idx}
            tile={tile}
            inDev={occupiedByAI(tile, shipsOnBoardAI)}
          />
        ))}
      </Grid2>
    );
  }
  return (
    <Grid2 container columns={{ xs: 10 }} style={{ width: 600, padding: 0 }}>
      {tiles.map((tile) => (
        <Tile key={tile.idx} tile={tile} />
      ))}
    </Grid2>
  );
};

export default Board;
