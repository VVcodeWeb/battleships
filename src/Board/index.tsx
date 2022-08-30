import { useContext } from "react";
import { animated, useSpring } from "react-spring";

import Grid2 from "@mui/material/Unstable_Grid2";
import { useMediaQuery } from "@mui/material";

import Tile from "Board/Tile";
import { GameContext } from "SinglePlayer/context/GameContext";
import { TileType } from "Board/types";
import {
  COLUMNS,
  FIGHTING,
  GAME_OVER,
  MIN_MD_WIDTH,
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
  const { enemyShips, gameStage } = useContext(GameContext);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const [styles, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  const occupiedByEnemy = (tile: any, ships: any) => {
    if (gameStage !== GAME_OVER) return false;
    for (let ship of ships)
      if (ship.x === tile.x && ship.y === tile.y) return true;

    return false;
  };

  if (hidden) return <></>;
  return (
    <animated.div style={styles}>
      <Grid2
        container
        direction={{ md: "row", xs: "column" }}
        justifyContent="center"
        alignItems="top"
      >
        <Grid2
          container
          columns={COLUMNS}
          style={{
            padding: 0,
            width: isWiderMD ? COLUMNS * WIDTH : COLUMNS * SMALLER_WIDTH,
          }}
        >
          {tiles.map((tile) => (
            <Tile key={tile.idx} tile={tile} />
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
