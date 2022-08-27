import { useContext, useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Divider, Modal } from "@mui/material";

import BoardProvider from "Board/context/BoardContext";
import { GameContext } from "SinglePlayer/context/GameContext";
import { BOT, HUMAN } from "constants/const";
import loseImg from "components/../../public/lose.png";
import winImg from "components/../../public/win.png";
import { useNavigate } from "react-router-dom";
import Chat from "SinglePlayer/Chat";
import { Player } from "SinglePlayer/types";
import Game from "SinglePlayer/Game";
import GameButton from "components/GameButton";
export const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SinglePlayer = () => {
  const { winner, playAgain } = useContext(GameContext);
  const [open, setOpen] = useState<boolean>(false);
  const naviagte = useNavigate();
  const handleModalClose = () => setOpen(false);
  const onPlayAgainClick = () => playAgain();
  const onMainMenuClick = () => naviagte("/");

  useEffect(() => setOpen(Boolean(winner)), [winner]);

  const GameOverImage = ({ winner }: { winner: Player | null }) => {
    const imgSize = {
      width: 400,
      height: 400,
    };
    if (winner === HUMAN) return <img style={imgSize} src={winImg} alt="win" />;
    if (winner === BOT) return <img style={imgSize} src={loseImg} alt="lose" />;
    return <>Invalid winner</>;
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Modal open={open} onClose={handleModalClose}>
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
      <Grid2 container direction="row" justifyContent="center" height="100%">
        <Grid2
          container
          xs={12}
          md={12}
          justifyContent="center"
          alignItems="flex-start"
          marginTop={2}
        >
          <Chat />
        </Grid2>
        <BoardProvider>
          <Game />
        </BoardProvider>
      </Grid2>
    </DndProvider>
  );
};

export default SinglePlayer;
