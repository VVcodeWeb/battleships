import { useContext, useEffect } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardContent, CardHeader } from "@mui/material";

import Board from "Board";
import BoardProvider, { BoardContext } from "Board/context/BoardContext";
import ShipDocks from "ShipDocks";
import { GameContext } from "SinglePlayer/context/useGameContext";
import { FIGHTING } from "constants/const";
export const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
const SinglePlayer = () => {
  const { gameStage, gameLog } = useContext(GameContext);

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid2
        container
        direction="row"
        justifyContent="center"
        spacing={3}
        height="100%"
      >
        <Grid2
          container
          xs={12}
          md={12}
          justifyContent="center"
          alignItems="flex-start"
          marginTop={2}
        >
          <Card
            style={{
              minWidth: 300,
            }}
          >
            <CardHeader title="Game Log" />
            <CardContent>
              <div style={{ overflowY: "scroll", maxHeight: "100%" }}>
                {gameLog.map((log) => (
                  <p>
                    Player {log.player} hits x: {log.x} y: {log.y}. It
                    {log.success ? "hits" : "misses"}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid2>
        <BoardProvider>
          <Grid2 xs={12} md={6} mdOffset={0}>
            <Board enemy={false} />
          </Grid2>

          <Grid2 xs={12} md={5}>
            {gameStage !== FIGHTING && <ShipDocks />}
            {gameStage === FIGHTING && <Board enemy />}
          </Grid2>
        </BoardProvider>
      </Grid2>
    </DndProvider>
  );
};

export default SinglePlayer;
