import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import { FIGHTING, GAME_OVER, PLANNING, READY } from "constants/const";
import useGetGameContext from "Game/hooks/useGetGameContext";
import { LOBBY } from "MultiPlayer/context/MultiPlayerContext";
import useStyles from "hooks/useStyle";
import RenderGameLog from "components/Chat/RenderGameLog";
const container: React.CSSProperties = {
  overflowY: "scroll",
  height: 80,
  overflowX: "hidden",
};
//TODO: Expand the log on click
const Chat = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const { stage, gameLog } = useGetGameContext();

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [gameLog, scrollRef]);

  const RenderPlanning = () => (
    <div style={{ width: "100%", color: "#5A5A5A" }}>
      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2 container xs={12} justifyContent="center" alignItems="center">
          <Typography>Planning stage</Typography>
        </Grid2>
        <Grid2 xs={12} style={{ textAlign: "center" }}>
          <Typography>
            Drag and drop 🤏 ships into the board or use the "auto" button
          </Typography>
        </Grid2>
      </Grid2>
    </div>
  );

  const ChatIcon = {
    [PLANNING]: <Avatar style={{ background: "transparent" }}>📝</Avatar>,
    [FIGHTING]: <></>,
    [LOBBY]: <Avatar style={{ background: "transparent" }}>📡</Avatar>,
    [READY]: <Avatar style={{ background: "transparent" }}>✅</Avatar>,
    [GAME_OVER]: <Avatar style={{ background: "transparent" }}>�</Avatar>,
  };
  const ChatContent = {
    [PLANNING]: <RenderPlanning />,
    [FIGHTING]: <RenderGameLog gameLog={gameLog} />,
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
      <CardContent
        style={{ padding: 0, marginRight: 10, position: "relative" }}
      >
        <div style={{ position: "absolute", right: -10, top: 0 }}>
          {ChatIcon[stage]}
        </div>
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
