import { useNavigate, useParams } from "react-router-dom";
import { memo, useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Tooltip,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import Background from "components/Background";
import useSocket from "MultiPlayer/hooks/useSocket";
import Game from "Game";
import { LOBBY, PLANNING } from "constants/const";
import { MultiPlayerContext } from "MultiPlayer/context/MultiPlayerContext";
import useStyles from "hooks/useStyle";

const Room = () => {
  const { roomID } = useParams();
  const {
    invalidRoomListener,
    joinRoom,
    planningStageListener,
    gameLogListener,
    gameOverListener,
    isConnected,
  } = useSocket();
  const { stage, setGameStage, updateGameLog, gameOver } =
    useContext(MultiPlayerContext);
  const nav = useNavigate();
  useEffect(() => {
    if (isConnected) {
      joinRoom();
    }
  }, [isConnected, joinRoom]);
  //TODO: refactor
  useEffect(() => {
    invalidRoomListener(() => nav("/multi"));
    planningStageListener(() => setGameStage(PLANNING));
    gameLogListener((gameLog) => updateGameLog(gameLog));
    gameOverListener((data) => gameOver(data.winner, data.enemyShips));
    return () => {
      invalidRoomListener();
      planningStageListener();
      gameLogListener();
      gameOverListener();
    };
  }, [
    joinRoom,
    gameOver,
    gameLogListener,
    invalidRoomListener,
    nav,
    planningStageListener,
    setGameStage,
    updateGameLog,
    gameOverListener,
  ]);

  //todo: add animation
  const CopyOnClick = ({ text }: { text: string }) => {
    const styles = useStyles();
    const onClick = () => navigator.clipboard.writeText(text);
    return (
      <Tooltip title="Copy to the clipboard" placement="top">
        <Typography
          onClick={onClick}
          style={{
            cursor: "copy",
            textAlign: "center",
            width: "60%",
            margin: "0 auto",
            background: styles.mainColor,
            padding: 5,
            borderRadius: 15,
          }}
        >
          {text}
        </Typography>
      </Tooltip>
    );
  };

  const LobbyCard = ({
    header,
    children,
  }: {
    header: string;
    children: any;
  }) => (
    <Grid2 xs={4} height={150}>
      <Card elevation={3} style={{ height: "100%" }}>
        <CardHeader title={header} style={{ textAlign: "center" }} />
        <CardContent>{children}</CardContent>
      </Card>
    </Grid2>
  );
  return (
    <Background>
      {stage === LOBBY && (
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          display="flex"
          gap={2}
          direction="row"
          style={{
            position: "absolute",
            minWidth: "100%",
            left: 0,
            top: "40%",
          }}
        >
          <LobbyCard header="Room ID">
            <CopyOnClick text={roomID as string} />
          </LobbyCard>
          <LobbyCard header="Send the invite link">
            <CopyOnClick text={window.location.href} />
          </LobbyCard>
        </Grid2>
      )}
      <Game />
    </Background>
  );
};

export default memo(Room);
