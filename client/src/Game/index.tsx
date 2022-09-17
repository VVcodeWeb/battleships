import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Grid2 from "@mui/material/Unstable_Grid2";
import { Modal, Divider } from "@mui/material";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import BoardProvider from "Game/Board/context/BoardContext";
import { ENEMY, ALLY } from "constants/const";
import PlayGround from "Game/PlayGround";
import GameButton from "components/GameButton";
import useGetGameContext from "Game/hooks/useGetGameContext";
import GameOverImage from "components/GameOverImage";
import PlayerMainAvatar from "components/PlayerMainAvatar";
import Log from "Game/Log";
export const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Game = () => {
  const naviagte = useNavigate();
  const { winner, playAgain } = useGetGameContext();

  const [open, setOpen] = useState<boolean>(false);
  const onPlayAgainClick = () => playAgain();
  const onMainMenuClick = () => naviagte("/");
  //todo rewrite without useeffect
  useEffect(() => setOpen(Boolean(winner)), [winner]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Modal open={open}>
        <Grid2
          container
          justifyContent="flex-end"
          direction="column"
          alignItems="center"
          spacing={4}
        >
          <Grid2 justifyContent="center" alignItems="center">
            <GameOverImage winner={winner} />
          </Grid2>
          <Grid2 container justifyContent="center" alignItems="center">
            <GameButton text="Play again" onClick={onPlayAgainClick} />
            <Divider variant="middle" />
            <GameButton text="Main menu" onClick={onMainMenuClick} />
          </Grid2>
        </Grid2>
      </Modal>
      <Grid2
        container
        direction="row"
        minHeight="100vh"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid2
          container
          xs={12}
          md={12}
          justifyContent="center"
          gap={2}
          alignItems="center"
        >
          <PlayerMainAvatar player={ALLY} />
          <Log />
          <PlayerMainAvatar player={ENEMY} />
        </Grid2>
        <Grid2
          container
          xs={12}
          md={12}
          justifyContent="space-between"
          alignItems="center"
          margin={4}
        >
          <BoardProvider>
            <PlayGround />
          </BoardProvider>
        </Grid2>
      </Grid2>
    </DndProvider>
  );
};

export default Game;
