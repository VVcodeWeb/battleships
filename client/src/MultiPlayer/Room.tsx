import { useNavigate, useParams } from "react-router-dom";
import { memo, useContext, useEffect } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";

import Background from "components/Background";
import Game from "Game";
import { MultiPlayerContext } from "MultiPlayer/context/MultiPlayerContext";
import CopyOnClick from "MultiPlayer/components/CopyOnClick";
import LobbyCard from "MultiPlayer/components/LobbyCard";
import { SocketContext } from "MultiPlayer/context/SocketContext";
import { FIGHTING, GAME_OVER, WAITING_FOR_PLAYERS } from "shared/constants";
import { FightingStageData, GameOverData } from "@shared/types";

const Room = () => {
  const { roomID } = useParams();
  const { socket } = useContext(SocketContext);
  const nav = useNavigate();
  const { stage, setGameStage, updateGameLog, serverStartsGame, gameOver } =
    useContext(MultiPlayerContext);

  useEffect(() => {
    console.log(`user with id is joining the room`);
    socket.emit("room:join", roomID as string, (response) => {
      if (response.error) nav("/404");
    });
  }, [roomID, socket, nav]);

  useEffect(() => {
    const isFightingStageData = (
      data: FightingStageData | GameOverData | undefined
    ): data is FightingStageData =>
      (data as FightingStageData)?.firstMove !== undefined;
    const isGameOverData = (
      data: FightingStageData | GameOverData | undefined
    ): data is GameOverData => (data as GameOverData)?.winner !== undefined;

    socket.on("game:update", (serverGameLog) => {
      updateGameLog(serverGameLog);
    });

    socket.on("stage:set", (stage, data) => {
      switch (stage) {
        case FIGHTING:
          isFightingStageData(data) && serverStartsGame(data);
          break;
        case GAME_OVER:
          isGameOverData(data) && gameOver(data);
          break;
        default:
          setGameStage(stage);
      }
    });

    return () => {
      socket.removeListener("stage:set");
      socket.removeListener("game:update");
    };
  }, [gameOver, serverStartsGame, setGameStage, socket, updateGameLog]);

  //todo: add animation
  return (
    <Background>
      {stage === WAITING_FOR_PLAYERS && (
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
