import { useContext, useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Divider, Modal, useMediaQuery } from "@mui/material";

import BoardProvider from "SinglePlayer/Board/context/BoardContext";
import { GameContext } from "SinglePlayer/context/GameContext";
import { BOT, HUMAN, MIN_MD_WIDTH } from "constants/const";
import loseImg from "components/../../public/lose.png";
import winImg from "components/../../public/win.png";
import background2 from "components/../../public/background_2.jpg";
import { useNavigate } from "react-router-dom";
import Chat from "components/Chat";
import { Player } from "SinglePlayer/types";
import Game from "SinglePlayer/PlayGround";
import GameButton from "components/GameButton";
export const flex = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const SinglePlayer = () => {
  const naviagte = useNavigate();
  const { winner, playAgain, gameLog } = useContext(GameContext);
  const [open, setOpen] = useState<boolean>(false);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);
  const onPlayAgainClick = () => playAgain();
  const onMainMenuClick = () => naviagte("/");
  useEffect(() => setOpen(Boolean(winner)), [winner]);

  //todo: add the winner avatar
  const GameOverImage = ({ winner }: { winner: Player | null }) => {
    const imgSize = {
      width: isWiderMD ? 500 : 350,
      maxWidth: "100%",
      height: 400,
    };
    if (winner === HUMAN) return <img style={imgSize} src={winImg} alt="win" />;
    if (winner === BOT) return <img style={imgSize} src={loseImg} alt="lose" />;
    return <>Invalid winner</>;
  };
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
        style={{
          background: `url(${background2})`,
          backgroundSize: "100% 100%",
        }}
      >
        <Grid2
          container
          xs={12}
          md={12}
          justifyContent="center"
          alignItems="center"
        >
          <Chat gameLog={gameLog} />
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
            <Game />
          </BoardProvider>
        </Grid2>
      </Grid2>
    </DndProvider>
  );
};

export default SinglePlayer;
