import { ALLY, ENEMY } from "shared/constants";
import useGetGameContext from "Game/hooks/useGetGameContext";
import PlayerAvatar from "components/PlayerAvatar";
import { FIGHTING } from "shared/constants";
import { Player } from "@shared/types";
type PlayerAvatarType = {
  player: Player;
};
function withMainAvatar<T extends PlayerAvatarType = PlayerAvatarType>(
  WrappedComponent: React.ComponentType<T>
) {
  const ComponentMainAvatar = ({ player, ...rest }: PlayerAvatarType) => {
    const { currentPlayersTurn, stage } = useGetGameContext();
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

    const isPlayersTurnStyle: React.CSSProperties | null =
      stage === FIGHTING
        ? {
            boxShadow: getBoxShadow(player, currentPlayersTurn === player),
          }
        : null;

    const size = {
      width: 70,
      height: 70,
    };
    return (
      <WrappedComponent
        {...isPlayersTurnStyle}
        {...size}
        {...(rest as T)}
        player={player}
      />
    );
  };
  return ComponentMainAvatar;
}

export default withMainAvatar(PlayerAvatar);
