import Grid2 from "@mui/material/Unstable_Grid2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import GameBoard from "GameBoard";
import GameBoardProvider from "GameBoard/context/GameBoardContext";
import ShipDocks from "ShipDocks";

const SinglePlayer = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Grid2
        container
        direction="row"
        spacing={1}
        justifyContent="space-around"
        style={{ height: "auto" }}
      >
        <GameBoardProvider>
          <Grid2 xs={11} md={6}>
            <GameBoard />
          </Grid2>
        </GameBoardProvider>
        <Grid2 xs={11} md={4}>
          <ShipDocks />
        </Grid2>
      </Grid2>
    </DndProvider>
  );
};

export default SinglePlayer;
