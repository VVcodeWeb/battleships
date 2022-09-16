import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import Grid2 from "@mui/material/Unstable_Grid2";
import Background from "components/Background";
import useSocket from "MultiPlayer/hooks/useSocket";
import Game from "Game";
import {
  LOBBY,
  MultiPlayerContext,
} from "MultiPlayer/context/MultiPlayerContext";
import useGetGameContext from "Game/hooks/useGetGameContext";

const Room = () => {
  const { greetingsListener, invalidRoomListener, roomID, gameStageListener } =
    useSocket();
  const { stage, setGameStage } = useContext(MultiPlayerContext);
  const nav = useNavigate();
  const [players, setPlayers] = useState<string[]>([]);

  //todo refactoring
  useEffect(() => {
    console.log("re render");
    greetingsListener((players) => {
      console.log({ players });
      setPlayers(players);
    });
    invalidRoomListener(() => nav("/multi"));
    gameStageListener((newStage) => {
      console.log("new stage " + newStage);
      console.log(setGameStage);
      setGameStage(newStage);
    });
    return () => {
      greetingsListener();
      invalidRoomListener();
      gameStageListener();
    };
  }, [
    gameStageListener,
    greetingsListener,
    invalidRoomListener,
    nav,
    setGameStage,
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

export default Room;
