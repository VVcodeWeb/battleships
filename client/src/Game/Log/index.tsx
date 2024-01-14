import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import useGetGameContext from "Game/hooks/useGetGameContext";
import useStyles from "hooks/useStyle";
import PlayerAvatar from "components/PlayerAvatar";
import Entry from "Game/Log/Entry";
import {
  PLANNING,
  FIGHTING,
  WAITING_FOR_PLAYERS,
  READY,
  GAME_OVER,
} from "shared/constants";
import { ClientLogEntry } from "@shared/types";

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
  );

  const RenderLobbyWaiting = () => {
    return (
      <div style={{ width: "100%", color: "#5A5A5A" }}>
        <Grid2 container justifyContent="center" alignItems="center">
          <Grid2 xs={12} style={{ textAlign: "center" }}>
            <Typography>Waiting for another player to join</Typography>
          </Grid2>
        </Grid2>
      </div>
    );
  };

  const RenderReadyWaiting = () => (
    <div style={{ width: "100%", color: "#5A5A5A" }}>
      <Grid2 container justifyContent="center" alignItems="center">
        <Grid2 xs={12} style={{ textAlign: "center" }}>
          <Typography>Waiting for another player...</Typography>
        </Grid2>
      </Grid2>
    </div>
  );

  const RenderGameOver = () => {
    const { winner } = useGetGameContext();
    if (!winner) return <></>;
    return (
      <Grid2 container justifyContent="center" alignItems="center" gap={2}>
        <Typography color="#586885">Winner </Typography>
        <PlayerAvatar player={winner} />
      </Grid2>
    );
  };
  const RenderGameLog = () => {
    const { currentPlayersTurn } = useGetGameContext();
    const firstTurnPlayer =
      gameLog.length > 0 ? gameLog[0].player : currentPlayersTurn;

    const timestampToDisplay = (
      log: ClientLogEntry,
      nextLog?: ClientLogEntry
    ) => log.player !== nextLog?.player;

    return (
      <div style={{ color: "black", textAlign: "center", width: "100%" }}>
        <Grid2 container justifyContent="center" alignItems="center" gap={2}>
          <Typography color="#586885">First turn </Typography>
          <PlayerAvatar player={firstTurnPlayer} />
        </Grid2>
        {gameLog.map((log, index) => (
          <Entry
            log={log}
            key={`player-${log.player}-x-${log.x}-y-${log.y}`}
            displayTimestamp={timestampToDisplay(log, gameLog[index + 1])}
          />
        ))}
      </div>
    );
  };

  const LogIcon = {
    [PLANNING]: <Avatar style={{ background: "transparent" }}>📝</Avatar>,
    [FIGHTING]: <></>,
    [WAITING_FOR_PLAYERS]: (
      <Avatar style={{ background: "transparent" }}>📡</Avatar>
    ),
    [READY]: <Avatar style={{ background: "transparent" }}>✔️</Avatar>,
    [GAME_OVER]: <Avatar style={{ background: "transparent" }}>�</Avatar>,
  };
  const LogContent = {
    [PLANNING]: <RenderPlanning />,
    [FIGHTING]: <RenderGameLog />,
    [WAITING_FOR_PLAYERS]: <RenderLobbyWaiting />,
    [READY]: <RenderReadyWaiting />,
    [GAME_OVER]: <RenderGameOver />,
  };
  return (
    <Card
      style={{
        width: styles.chatSize,
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
      <CardContent style={{ padding: 0, position: "relative" }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          {LogIcon[stage]}
        </div>
        <div
          style={{ ...container, padding: 15, color: "black" }}
          className="no_scroll_bar"
        >
          <Grid2 container justifyContent="center" alignItems="center">
            {LogContent[stage]}
          </Grid2>
          <div ref={scrollRef}></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
