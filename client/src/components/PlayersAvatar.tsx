import { Avatar } from "@mui/material";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import { ALLY, ENEMY } from "constants/const";
import { Player } from "Game/types";
import defaultAvatarImg from "components/../../public/default_avatar.png";
import useStyles from "hooks/useStyle";

const PlayersAvatar = ({
  player,
  playersTurn,
}: {
  player: Player;
  playersTurn: boolean;
}) => {
  const styles = useStyles();
  const getBoxShadow = (player: Player, playersTurn: boolean) => {
    const allyPlayerActive =
      "0 0 15px 5px #ADD8E6, 0 0 20px 5px #6f0, 0 0 15px 10px #0ff";
    const allyPlayerPassive =
      "0 0 1px 1px #ADD8E6, 0 0 3px 4px #6f0, 0 0 1px 1px #0ff";

    const enemyPlayerActive =
      "0 0 15px 5px #a60000, 0 0 20px 5px #cb0000, 0 0 15px 10px #ff5b5b";
    const enemyPlayerPassive =
      "0 0 1px 1px #a60000, 0 0 3px 4px #cb0000, 0 0 1px 1px #ff5b5b";
    if (player === ALLY && playersTurn) return allyPlayerActive;
    if (player === ALLY && !playersTurn) return allyPlayerPassive;
    if (player === ENEMY && playersTurn) return enemyPlayerActive;
    return enemyPlayerPassive;
  };

  const isPlayersTurnStyle: React.CSSProperties = {
    boxShadow: getBoxShadow(player, playersTurn),
  };
  return (
    <Avatar
      sx={{
        width: 70,
        height: 70,
        background: styles.mainColor,
        ...isPlayersTurnStyle,
      }}
      src={player === ALLY ? defaultAvatarImg : undefined}
    >
      {player !== ALLY && (
        <SmartToyOutlinedIcon
          style={{ color: "white", width: 70, height: 70 }}
        />
      )}
    </Avatar>
  );
};

export default PlayersAvatar;
