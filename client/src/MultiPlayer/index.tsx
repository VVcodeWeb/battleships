import { ChangeEvent, useState } from "react";

import { Input } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import backgroundMulti from "components/../../public/multi2.png";
import GameButton from "components/GameButton";

const MultiPlayer = () => {
  const [name, setName] = useState<string>("");

  const Lobby = () => {
    return (
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
        <p>{name}</p>
      </Grid2>
    );
  };

  const SetupGame = ({ setName }: { setName: any }) => {
    const [value, setValue] = useState<string>("");
    const onChange = (e: ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value);

    const onClick = () => setName(value);

    return (
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
        <Input onChange={onChange} value={value} />
        <GameButton
          disabled={!Boolean(value)}
          onClick={onClick}
          text="Join a game"
        />
      </Grid2>
    );
  };
  return (
    <Grid2
      container
      direction="row"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      style={{
        background: `url(${backgroundMulti})`,
        backgroundSize: "100% 100%",
      }}
    >
      {name.length > 0 ? <Lobby /> : <SetupGame setName={setName} />}
    </Grid2>
  );
};

export default MultiPlayer;
