import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

import { ALLY } from "constants/const";
import { LogEntry, Player } from "Game/types";
import { getLetterByX } from "utils";

const entryLog: React.CSSProperties = {
  fontFamily: "serif",
  height: 40,
};

const Timestamp = ({
  timestamp,
  player,
}: {
  timestamp: number;
  player: Player;
}) => {
  const formatDate = new Date(timestamp)?.toLocaleString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return (
    <Typography
      fontSize={10}
      style={{
        textAlign: player === ALLY ? "left" : "right",
        color: "#586885",
        marginTop: -3,
      }}
    >
      {formatDate}
    </Typography>
  );
};
const Entry = ({
  log,
  displayTimestamp,
}: {
  log: LogEntry;
  displayTimestamp: boolean;
}) => {
  return (
    <>
      <Grid2
        container
        justifyContent="flex-start"
        alignItems="center"
        direction={log.player === ALLY ? "row" : "row-reverse"}
        style={entryLog}
      >
        <Grid2
          style={{
            background: "#d8e5ff",
            padding: 10,
            borderRadius: 5,
            color: "#586885",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {getLetterByX(log.x)}:{log.y + 1}.
          {log.success ? (
            <span style={{ color: "green", paddingLeft: 5 }}>Success</span>
          ) : (
            <> Miss</>
          )}
          {log.destroyed && <span>. Destroyed: {log.destroyed[0].name}</span>}
        </Grid2>
      </Grid2>
      {displayTimestamp && (
        <Timestamp
          key={`player-timestamp-${log.player}-x-${log.x}-y-${log.y}`}
          timestamp={log.timestamp}
          player={log.player}
        />
      )}
    </>
  );
};

export default Entry;
