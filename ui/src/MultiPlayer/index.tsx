import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import GameButton from "components/GameButton";
import Background from "components/Background";
import configuration from "config/configuration";
import { USER_ID } from "shared/constants";

const MultiPlayer = () => {
  const [roomID, setRoomID] = useState<string>("");
  const nav = useNavigate();
  const onChangeRoomID = (e: ChangeEvent<HTMLInputElement>) =>
    setRoomID(e.target.value);

  const onCreateRoomClick = async () => {
    console.log("new room click");
    console.log("Navigating to the new room");
    fetch(`${configuration.apiUrl}/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem(USER_ID),
      }),
    })
      .then(async (res) => {
        const roomId = (await res.json()).roomId;
        nav(`/multi/${roomId}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const onJoinRoomClick = () => nav(`/multi/${roomID}`);

  return (
    <Background>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        display="flex"
        direction="column"
        gap={2}
        style={{
          minHeight: 200,
          minWidth: 200,
          background: "white",
        }}
      >
        <Input onChange={onChangeRoomID} value={roomID} />
        <GameButton
          disabled={!Boolean(roomID)}
          onClick={onJoinRoomClick}
          text="Join a game"
        />
      </Grid2>
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        display="flex"
        direction="column"
        gap={2}
        style={{
          minHeight: 200,
          minWidth: 200,
          background: "white",
        }}
      >
        <GameButton onClick={onCreateRoomClick} text="Create a game" />
      </Grid2>
    </Background>
  );
};

export default MultiPlayer;
