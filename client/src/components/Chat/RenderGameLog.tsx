import { Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import PlayerAvatar from "components/PlayerAvatar";
import { ALLY } from "constants/const";
import useGetGameContext from "Game/hooks/useGetGameContext";
import { LogEntry, Player } from "Game/types";

const entryLog: React.CSSProperties = {
  fontFamily: "serif",
  height: 40,
};
const getLetterByX = (x: number) => String.fromCharCode(65 + x);

//TODO: add animation
const RenderGameLog = ({ gameLog }: { gameLog: LogEntry[] }) => {
  const { currentPlayersTurn } = useGetGameContext();
  const Entry = ({ log }: { log: LogEntry }) => {
    return (
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
  const Timestamp = ({
    timestamp,
    player,
  }: {
    timestamp: number;
    player: Player;
  }) => {
    if (timestamp) date.setSeconds(timestamp);
    const formatDate = date.toLocaleString([], {
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
  const firstTurnPlayer =
    gameLog.length > 0 ? gameLog[0].player : currentPlayersTurn;
  const date = new Date();

  const timestampToDisplay = (log: LogEntry, nextLog?: LogEntry) => {
    /*     const lastIndex = _.findLastIndex(gameLog, (log) => log.player === player); */
    if (log.player === nextLog?.player) return false;
    return true;
  };
  return (
    <div style={{ color: "black", textAlign: "center" }}>
      <Grid2 container justifyContent="center" alignItems="center" gap={2}>
        <Typography>First turn </Typography>
        <PlayerAvatar player={firstTurnPlayer} />
      </Grid2>
      {gameLog.map((log, index) => (
        <>
          <Entry log={log} key={`player-${log.player}-x-${log.x}-y-${log.y}`} />
          {timestampToDisplay(log, gameLog[index + 1]) && (
            <Timestamp timestamp={log.timestamp} player={log.player} />
          )}
        </>
      ))}
    </div>
  );
};

export default RenderGameLog;
