import { useContext } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import { useMediaQuery } from "@mui/material";

import { BoardContext } from "Board/context/BoardContext";
import { GameContext } from "SinglePlayer/context/GameContext";
import { generateBoardAI } from "utils/ai";
import ShipDocks from "ShipDocks";
import Board from "Board";
import GameButton from "components/GameButton";
import {
  COLUMNS,
  FIGHTING,
  GAME_OVER,
  MAX_SHIPS,
  MIN_MD_WIDTH,
  PLANNING,
  READY,
  SMALLER_WIDTH,
  WIDTH,
} from "constants/const";
import Tile from "Board/Tile";
import HitpointsBar from "Board/HitpointsBar";
import { TileType } from "Board/types";

const Game = () => {
  const { gameStage, setGameStage, surrender } = useContext(GameContext);
  const { dockShips, autoSetBoard, tiles, enemyTiles, resetBoard } =
    useContext(BoardContext);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const onAutoPlacementBoard = () => autoSetBoard(generateBoardAI().tiles);
  const onReadyClick = () => setGameStage(READY);
  const onSurrenderClick = () => surrender();
  const onResetClick = () => resetBoard();

  const getPartsDamaged = (tiles: TileType[]): number =>
    tiles.filter((tile) => tile.shelled && tile.occupiedBy).length;
  const TilesContainer = ({ children }: any) => (
    <Grid2
      container
      columns={COLUMNS}
      style={{
        padding: 0,
        width: isWiderMD ? COLUMNS * WIDTH : COLUMNS * SMALLER_WIDTH,
      }}
    >
      {children}
    </Grid2>
  );

  //TODO: idea: add transition animation for the buttons
  return (
    <>
      <Grid2 xs={12} md={5} justifyContent={isWiderMD ? "center" : "start"}>
        <Board>
          <TilesContainer>
            {tiles.map((tile) => (
              <Tile key={tile.idx} tile={tile} />
            ))}
          </TilesContainer>
          <HitpointsBar numDamagedParts={getPartsDamaged(tiles)} />
        </Board>
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
        justifyContent={isWiderMD ? "center" : "start"}
        alignItems="flex-start"
        container
      >
        <ShipDocks hidden={gameStage !== PLANNING} />
        <Board hidden={gameStage !== GAME_OVER && gameStage !== FIGHTING}>
          <TilesContainer>
            {enemyTiles.map((tile) => (
              <Tile key={tile.idx} tile={tile} />
            ))}
          </TilesContainer>
          <HitpointsBar numDamagedParts={getPartsDamaged(enemyTiles)} />
        </Board>
      </Grid2>
    </>
  );
};

export default Game;
