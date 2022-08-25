import { useContext } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import Tile from "GameBoard/Tile";
import { GameContext } from "GameBoard/context/GameBoardContext";

const GameBoard = () => {
  const { tiles } = useContext(GameContext);
  return (
    <Grid2 container columns={{ xs: 10 }} style={{ width: 600, padding: 0 }}>
      {tiles.map((tile) => (
        <Tile key={tile.idx} tile={tile} />
      ))}
    </Grid2>
  );
};

export default GameBoard;
