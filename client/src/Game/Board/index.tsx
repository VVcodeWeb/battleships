import { animated, useSpring } from "react-spring";

import Grid2 from "@mui/material/Unstable_Grid2";

import Tile from "Game/Board/Tile";
import { TileType } from "Game/Board/types";
import { COLUMNS, PLANNING, READY } from "constants/const";
import HitpointsBar from "Game/Board/HitpointsBar";
import useGetGameContext from "Game/hooks/useGetGameContext";
import useStyles from "hooks/useStyle";

const Board = ({ tiles, hidden }: { tiles: TileType[]; hidden?: boolean }) => {
  const { stage } = useGetGameContext();
  const styles = useStyles();

  //TODO: animations
  const [animStyles] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  const getPartsDamaged = (tiles: TileType[]): number =>
    tiles.filter((tile) => tile.shelled && tile.occupiedBy).length;

  if (hidden) return <></>;
  return (
    <animated.div style={animStyles}>
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
            width: styles.boardWidth,
          }}
        >
          {tiles.map((tile) => (
            <Tile key={`tile-${tile.x}-${tile.y}`} tile={tile} />
          ))}
        </Grid2>
        <HitpointsBar
          hidden={stage === PLANNING || stage === READY}
          numPartsDamaged={getPartsDamaged(tiles)}
        />
      </Grid2>
    </animated.div>
  );
};

export default Board;
