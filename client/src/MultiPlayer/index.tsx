import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import GameButton from "components/GameButton";
import Background from "components/Background";
import useSocket from "MultiPlayer/hooks/useSocket";

const MultiPlayer = () => {
  const [roomID, setRoomID] = useState<string>("");
  const { createNewRoom } = useSocket();
  const nav = useNavigate();
  const onChangeRoomID = (e: ChangeEvent<HTMLInputElement>) =>
    setRoomID(e.target.value);

  const onCreateRoomClick = () => {
    console.log("new room click");
    createNewRoom((id: any) => {
      console.log(id);
      nav(`/multi/${id}`);
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
