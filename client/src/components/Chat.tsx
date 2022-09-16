import React, { useEffect } from "react";
import { Card, CardHeader, CardContent, Avatar } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import Grid2 from "@mui/material/Unstable_Grid2";

import { LogEntry, StageType } from "Game/types";
import { ALLY, FIGHTING, GAME_OVER, PLANNING, READY } from "constants/const";
import defaultAvatarImg from "components/../../public/default_avatar.png";
import useGetGameContext from "Game/hooks/useGetGameContext";
import { LOBBY } from "MultiPlayer/context/MultiPlayerContext";
import useStyles from "hooks/useStyle";
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
//Expand the log on click
const Chat = ({ gameLog }: { gameLog: LogEntry[] }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const { stage } = useGetGameContext();

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
        direction={log.player === ALLY ? "row" : "row-reverse"}
        style={entryLog}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            background: styles.mainColor,
          }}
          src={log.player === ALLY ? defaultAvatarImg : undefined}
        >
          {log.player !== ALLY && (
            <SmartToyOutlinedIcon style={{ color: "white" }} />
          )}
        </Avatar>
        <Grid2
          style={{
            background: "#d8e5ff",
            padding: 10,
            borderRadius: 30,
            color: "#586885",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          shells {getLetterByX(log.x)}:{log.y + 1}.
          {log.success ? (
            <span style={{ color: "green", paddingLeft: 5 }}>Success</span>
          ) : (
            <> Miss</>
          )}
          {log.destroyed && <span>. Destroyed: {log.destroyed[0].name}</span>}
        </Grid2>
      </Grid2>
    );
  };

  const RenderGameLog = () => {
    return (
      <>
        {gameLog.length < 1 && <div style={emptyLogStyle}>Empty</div>}
        {gameLog.map((log) => (
          <Entry log={log} key={`player-${log.player}-x-${log.x}-y-${log.y}`} />
        ))}
      </>
    );
  };
  const ChatContent = {
    [PLANNING]: <div>planning</div>,
    [FIGHTING]: <RenderGameLog />,
    [LOBBY]: <div>lobby</div>,
    [READY]: <div>ready</div>,
    [GAME_OVER]: <div>game over</div>,
  };
  return (
    <Card
      style={{
        minWidth: 350,
        width: "40%",
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
          background: styles.mainColor,
        }}
      />
      <CardContent style={{ padding: 0 }}>
        <div
          style={{ ...container, padding: 15, color: "black" }}
          className="no_scroll_bar"
        >
          {ChatContent[stage]}
          <div ref={scrollRef}></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
