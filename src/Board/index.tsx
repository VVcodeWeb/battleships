import { useContext, useEffect } from "react";
import { animated, useSpring } from "react-spring";

import Grid2 from "@mui/material/Unstable_Grid2";

import Tile from "Board/Tile";
import { GameContext } from "SinglePlayer/context/GameContext";
import { TileType } from "Board/types";
import {
  COLUMNS,
  FIGHTING,
  GAME_OVER,
  SMALLER_WIDTH,
  WIDTH,
} from "constants/const";
import ProgressBar from "Board/ProgressBar";

const Board = ({
  enemy,
  tiles,
  hidden,
}: {
  enemy?: boolean;
  tiles: TileType[];
  hidden?: boolean;
}) => {
  /* For testing only, delete after */
  const { shipsOnBoardAI, gameStage } = useContext(GameContext);
  const [styles, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  useEffect(() => {
    api.start();
  }, [api]);
  const occupiedByAI = (tile: any, ships: any) => {
    if (gameStage !== GAME_OVER) return false;
    for (let ship of ships)
      if (ship.x === tile.x && ship.y === tile.y) return true;

    return false;
  };
  if (hidden) return <></>;
  return (
    <animated.div style={styles}>
      <Grid2 container direction="row" justifyContent="center" alignItems="top">
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
        {(gameStage === FIGHTING || gameStage === GAME_OVER) && (
          <ProgressBar enemy={Boolean(enemy)} />
        )}
      </Grid2>
    </animated.div>
  );
};

export default Board;
