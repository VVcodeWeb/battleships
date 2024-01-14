import { Avatar, Badge, styled } from "@mui/material";
import { ALLY, ENEMY } from "shared/constants";
import useStyles from "hooks/useStyle";
import defaultAvatarImg from "components/../../public/default_avatar.png";
import enemyAvatar from "components/../../public/enemy_avatar.png";
import botAvatar from "components/../../public/bot_avatar.png";
import { Player } from "@shared/types";

//TODO display if enemy is disconnected
const PlayerAvatar = ({ player, ...rest }: { player: Player }) => {
  const styles = useStyles();
  const singlePlayer = window.location.pathname.includes("single");
  const avatarAllyIcon = player === ALLY ? defaultAvatarImg : undefined;
  const avatarEnemyIcon =
    !singlePlayer && player === ENEMY ? enemyAvatar : undefined;
  const avatarBotIcon =
    singlePlayer && player === ENEMY ? botAvatar : undefined;
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: true ? "#44b700" : "red",
      color: true ? "#44b700" : "red",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  if (avatarBotIcon)
    return (
      <Avatar
        sx={{
          width: 35,
          height: 35,
          background: styles.mainColor,
          ...rest,
        }}
        src={avatarBotIcon}
      />
    );
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      variant="dot"
    >
      <Avatar
        sx={{
          width: 35,
          height: 35,
          background: styles.mainColor,
          ...rest,
        }}
        src={avatarAllyIcon ?? avatarEnemyIcon}
      />
    </StyledBadge>
  );
};

export default PlayerAvatar;
