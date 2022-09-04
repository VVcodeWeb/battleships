import { useContext } from "react";
import { animated, useSpring } from "react-spring";

import Grid2 from "@mui/material/Unstable_Grid2";
import { useMediaQuery } from "@mui/material";

import Tile from "SinglePlayer/Board/Tile";
import { GameContext } from "SinglePlayer/context/GameContext";
import { TileType } from "SinglePlayer/Board/types";
import {
  COLUMNS,
  MIN_MD_WIDTH,
  PLANNING,
  READY,
  SMALLER_WIDTH,
  WIDTH,
} from "constants/const";
import HitpointsBar from "SinglePlayer/Board/HitpointsBar";
import _ from "underscore";

//TODO: add whois turn
const Board = ({ tiles, hidden }: { tiles: TileType[]; hidden?: boolean }) => {
  const { gameStage, disposeEnemy } = useContext(GameContext);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const [styles, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  const getInDev = (tile: TileType) => {
    if (!tile.enemy) return false;
    const enemyShips = disposeEnemy();
    if (_.findWhere(enemyShips, { x: tile.x, y: tile.y })) return true;
    return false;
  };

  const getPartsDamaged = (tiles: TileType[]): number =>
    tiles.filter((tile) => tile.shelled && tile.occupiedBy).length;

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
            <Tile
              key={`tile-${tile.x}-${tile.y}`}
              tile={tile}
              inDev={getInDev(tile)}
            />
          ))}
        </Grid2>
        <HitpointsBar
          hidden={gameStage === PLANNING || gameStage === READY}
          numPartsDamaged={getPartsDamaged(tiles)}
        />
      </Grid2>
    </animated.div>
  );
};

export default Board;
