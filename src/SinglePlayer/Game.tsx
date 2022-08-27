import { useContext } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import { BoardContext } from "Board/context/BoardContext";
import { FIGHTING, PLANNING, READY } from "constants/const";
import { GameContext } from "SinglePlayer/context/GameContext";
import { generateBoardAI } from "utils/ai";
import ShipDocks from "ShipDocks";
import Board from "Board";
import GameButton from "components/GameButton";

const Game = () => {
  const { gameStage, setGameStage, surrender } = useContext(GameContext);
  const { dockShips, autoSetBoard, tiles, enemyTiles } =
    useContext(BoardContext);

  const onAutoPlacementBoard = () => autoSetBoard(generateBoardAI().tiles);
  const onReadyClick = () => setGameStage(READY);
  const onSurrenderClick = () => surrender();
  return (
    <>
      <Grid2 xs={12} md={5}>
        <Board enemy={false} tiles={tiles} />
      </Grid2>
      <Grid2
        xs={12}
        md={2}
        container
        direction={{ xs: "column", md: "row" }}
        justifyContent="center"
        alignItems="center"
      >
        {(gameStage === PLANNING || gameStage === READY) && (
          <GameButton
            text="Auto generate board"
            onClick={onAutoPlacementBoard}
          />
        )}
        {gameStage !== FIGHTING && dockShips.length < 1 && (
          <GameButton text="Ready" onClick={onReadyClick} />
        )}
        {gameStage === FIGHTING && (
          <GameButton text="Surrender" onClick={onSurrenderClick} />
        )}
      </Grid2>

      <Grid2
        xs={12}
        md={5}
        style={{ minHeight: 500 }}
        justifyContent="end"
        alignItems="flex-start"
        container
      >
        {gameStage !== FIGHTING && <ShipDocks />}
        {gameStage === FIGHTING && <Board enemy tiles={enemyTiles} />}
      </Grid2>
    </>
  );
};

export default Game;
