import React, { useContext, useEffect } from "react";
import { Card, CardHeader, CardContent, Avatar } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import Grid2 from "@mui/material/Unstable_Grid2";

import { GameContext } from "SinglePlayer/context/GameContext";
import { LogEntry } from "SinglePlayer/types";
import { HUMAN } from "constants/const";
import defaultAvatarImg from "components/../../public/default_avatar.jpg";
const container: React.CSSProperties = {
  overflowY: "scroll",
  height: 80,
  overflowX: "hidden",
};
const entryLog: React.CSSProperties = {
  fontFamily: "serif",
  height: 50,
};

const emptyLogStyle: React.CSSProperties = {
  textAlign: "center",
  color: "white",
  fontStyle: "italic",
};
const getLetterByX = (x: number) => String.fromCharCode(65 + x);
//TODO: add system messages like game stage, winner etc
//Expand the log on click
const Chat = () => {
  const { gameLog, gameStage } = useContext(GameContext);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [gameLog, scrollRef]);

  const Entry = ({ log }: { log: LogEntry }) => {
    return (
      <Grid2
        container
        justifyContent="flex-start"
        alignItems="center"
        direction={log.player === HUMAN ? "row" : "row-reverse"}
        style={entryLog}
      >
        <Avatar
          sx={{ width: 35, height: 35, background: "#ffb562" }}
          src={log.player === HUMAN ? defaultAvatarImg : undefined}
        >
          {log.player !== HUMAN && (
            <SmartToyOutlinedIcon style={{ color: "white" }} />
          )}
        </Avatar>
        <Grid2
          style={{
            background: "#ffb562",
            padding: 10,
            borderRadius: 30,
            color: "white",
            fontWeight: "bold",
          }}
        >
          <span style={{}}>{log.player}</span> shells {getLetterByX(log.x)}:
          {log.y + 1}.
          {log.success ? (
            <span style={{ color: "aquamarine", paddingLeft: 5 }}>Success</span>
          ) : (
            <> Miss</>
          )}
        </Grid2>
      </Grid2>
    );
  };

  return (
    <Card
      style={{
        minWidth: 350,
        width: "40%",
        /* background: "#B75E64", */
        background: "white",
        color: "white",
      }}
    >
      <CardHeader
        title="Game Log"
        disableTypography
        style={{
          fontSize: 20,
          padding: 10,
          textAlign: "center",
          /* color: "white", */
          background: "#ffb562",
        }}
      />
      <CardContent style={{ padding: 0 }}>
        <div style={{ ...container, padding: 15 }} className="no_scroll_bar">
          {gameLog.length < 1 && <div style={emptyLogStyle}>Empty</div>}
          {gameLog.map((log) => (
            <Entry
              log={log}
              key={`player-${log.player}-x-${log.x}-y-${log.y}`}
            />
          ))}
          <div ref={scrollRef}></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
