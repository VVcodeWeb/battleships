import { Avatar } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import { ALLY } from "constants/const";
import { Player } from "Game/types";
import defaultAvatarImg from "components/../../public/default_avatar.jpg";

const PlayersAvatar = ({
  player,
  playersTurn,
}: {
  player: Player;
  playersTurn: boolean;
}) => {
  const isPlayersTurnStyle: React.CSSProperties | null = playersTurn
    ? {
        boxShadow: "0 0 15px 5px #fff, 0 0 20px 5px #6f0, 0 0 15px 10px #0ff",
      }
    : null;
  return (
    <Avatar
      sx={{
        width: 90,
        height: 90,
        background: "#ffb562",
        ...isPlayersTurnStyle,
      }}
      src={player === ALLY ? defaultAvatarImg : undefined}
    >
      {player !== ALLY && (
        <SmartToyOutlinedIcon
          style={{ color: "white", width: 90, height: 90 }}
        />
      )}
    </Avatar>
  );
};

export default PlayersAvatar;
