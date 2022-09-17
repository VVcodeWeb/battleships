import { useContext, memo } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import { BoardContext } from "Game/Board/context/BoardContext";
import { generateBoardAI } from "utils/ai";
import ShipDocks from "Game/ShipDocks";
import Board from "Game/Board";
import GameButton from "components/GameButton";
import {
  FIGHTING,
  GAME_OVER,
  LOBBY,
  MAX_SHIPS,
  PLANNING,
  READY,
} from "constants/const";
import useGetGameContext from "Game/hooks/useGetGameContext";
import useStyles from "hooks/useStyle";

const PlayGround = () => {
  const styles = useStyles();
  const { stage, setGameStage, surrender } = useGetGameContext();
  const { dockShips, autoSetBoard, tiles, enemyTiles, resetBoard } =
    useContext(BoardContext);

  const onAutoPlacementBoard = () => autoSetBoard(generateBoardAI().tiles);
  const onReadyClick = () => setGameStage(READY);
  const onSurrenderClick = () => surrender();
  const onResetClick = () => resetBoard();

  //TODO:  add transition animation for the buttons
  return (
    <>
      <Grid2
        xs={12}
        md={stage === READY ? 12 : 5}
        justifyContent={styles.boardJustify}
      >
        <Board tiles={tiles} hidden={stage === LOBBY} />
      </Grid2>
      <Grid2
        xs={12}
        md={2}
        direction="column"
        justifyContent="space-around"
        alignItems="center"
        container
        spacing={4}
      >
        <Grid2>
          <GameButton
            hidden={stage !== FIGHTING}
            text="Surrender"
            onClick={onSurrenderClick}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={stage !== PLANNING}
            text="Auto generate board"
            onClick={onAutoPlacementBoard}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={stage !== PLANNING || dockShips.length > 0}
            text="Ready"
            onClick={onReadyClick}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={stage !== PLANNING || dockShips.length === MAX_SHIPS}
            text="Reset"
            onClick={onResetClick}
          />
        </Grid2>
      </Grid2>
      <Grid2
        xs={12}
        md={5}
        justifyContent={styles.playGroundJustify}
        alignItems="flex-start"
        container
      >
        <ShipDocks hidden={stage !== PLANNING} />
        <Board
          tiles={enemyTiles}
          hidden={stage !== FIGHTING && stage !== GAME_OVER}
        />
      </Grid2>
    </>
  );
};

export default PlayGround;
