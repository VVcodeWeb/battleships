import { useContext } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import Tile from "Board/Tile";
import { GameContext } from "SinglePlayer/context/GameContext";
import { TileType } from "Board/types";
import { COLUMNS, SMALLER_WIDTH, WIDTH } from "constants/const";

const Board = ({ enemy, tiles }: { enemy?: boolean; tiles: TileType[] }) => {
  /* For testing only, delete after */
  const { shipsOnBoardAI } = useContext(GameContext);
  const occupiedByAI = (tile: any, ships: any) => {
    for (let ship of ships)
      if (ship.x === tile.x && ship.y === tile.y) return true;

    return false;
  };
  return (
    <Grid2
      container
      columns={{ xs: COLUMNS }}
      style={{
        width: enemy ? SMALLER_WIDTH * COLUMNS : WIDTH * COLUMNS,
        padding: 0,
      }}
    >
      {tiles.map((tile) => (
        <Tile
          key={tile.idx}
          tile={tile}
          inDev={enemy && occupiedByAI(tile, shipsOnBoardAI)}
        />
      ))}
    </Grid2>
  );
};

export default Board;
