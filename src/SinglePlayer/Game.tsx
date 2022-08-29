import { useContext } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import { BoardContext } from "Board/context/BoardContext";
import {
  FIGHTING,
  GAME_OVER,
  MAX_SHIPS,
  PLANNING,
  READY,
} from "constants/const";
import { GameContext } from "SinglePlayer/context/GameContext";
import { generateBoardAI } from "utils/ai";
import ShipDocks from "ShipDocks";
import Board from "Board";
import GameButton from "components/GameButton";

const Game = () => {
  const { gameStage, setGameStage, surrender } = useContext(GameContext);
  const { dockShips, autoSetBoard, tiles, enemyTiles, resetBoard } =
    useContext(BoardContext);

  const onAutoPlacementBoard = () => autoSetBoard(generateBoardAI().tiles);
  const onReadyClick = () => setGameStage(READY);
  const onSurrenderClick = () => surrender();
  const onResetClick = () => resetBoard();
  return (
    <>
      <Grid2 xs={12} md={5}>
        <Board enemy={false} tiles={tiles} />
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
            hidden={gameStage !== FIGHTING}
            text="Surrender"
            onClick={onSurrenderClick}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={gameStage !== PLANNING}
            text="Auto generate board"
            onClick={onAutoPlacementBoard}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={gameStage !== PLANNING || dockShips.length > 0}
            text="Ready"
            onClick={onReadyClick}
          />
        </Grid2>
        <Grid2>
          <GameButton
            hidden={gameStage !== PLANNING || dockShips.length === MAX_SHIPS}
            text="Reset"
            onClick={onResetClick}
          />
        </Grid2>
      </Grid2>
      <Grid2
        xs={12}
        md={5}
        justifyContent="end"
        alignItems="flex-start"
        container
      >
        <ShipDocks hidden={gameStage !== PLANNING} />
        <Board
          enemy
          tiles={enemyTiles}
          hidden={gameStage !== FIGHTING && gameStage !== GAME_OVER}
        />
      </Grid2>
    </>
  );
};

export default Game;
