import { useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import ShipsDock from "components/ShipsDock";
import { getAllships } from "utils";
import GameBoard from "GameBoard";
import GameProvider from "GameBoard/context/GameBoardContext";

const SinglePlayer = () => {
  const [dockShips, setDockShips] = useState<any>([]);
  const [boardShips, setBoardShips] = useState<any>([]);
  useEffect(() => {
    setDockShips(getAllships());
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <GameProvider>
        <Grid2
          container
          direction="row"
          spacing={1}
          justifyContent="space-around"
          style={{ height: "auto" }}
        >
          <Grid2 xs={11} md={6}>
            <GameBoard />
          </Grid2>
          <Grid2 xs={11} md={4}>
            <ShipsDock fleet={dockShips} />
          </Grid2>
        </Grid2>
      </GameProvider>
    </DndProvider>
  );
};

export default SinglePlayer;
