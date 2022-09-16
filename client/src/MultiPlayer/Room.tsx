import { useNavigate, useParams } from "react-router-dom";
import { memo, useContext, useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import Background from "components/Background";
import useSocket from "MultiPlayer/hooks/useSocket";
import Game from "Game";
import {
  LOBBY,
  MultiPlayerContext,
} from "MultiPlayer/context/MultiPlayerContext";
import { PLANNING } from "constants/const";

const Room = () => {
  const { roomID } = useParams();
  const {
    greetingsListener,
    invalidRoomListener,
    joinRoom,
    planningStageListener,
    gameLogListener,
    gameOverListener,
  } = useSocket();
  const { stage, setGameStage, updateGameLog, gameOver } =
    useContext(MultiPlayerContext);
  const nav = useNavigate();
  const [players, setPlayers] = useState<string[]>([]);
  useEffect(() => {
    joinRoom();
    greetingsListener((players) => setPlayers(players));
    invalidRoomListener(() => nav("/multi"));
    planningStageListener(() => setGameStage(PLANNING));
    gameLogListener((gameLog) => updateGameLog(gameLog));
    gameOverListener((data) => gameOver(data.winner, data.enemyShips));
    return () => {
      greetingsListener();
      invalidRoomListener();
      planningStageListener();
      gameLogListener();
      gameOverListener();
    };
  }, [
    gameOver,
    gameLogListener,
    greetingsListener,
    invalidRoomListener,
    joinRoom,
    nav,
    planningStageListener,
    setGameStage,
    updateGameLog,
    gameOverListener,
  ]);

  return (
    <Background>
      {stage === LOBBY && (
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          display="flex"
          direction="column"
          style={{
            minHeight: 200,
            minWidth: 200,
            background: "white",
          }}
        >
          <p>Lobby</p>
          <p>Room id: {roomID}</p>
          {players?.map((player) => (
            <p key={player}>{player}</p>
          ))}
        </Grid2>
      )}
      {stage !== LOBBY && <Game />}
    </Background>
  );
};

export default memo(Room);
