import { ALLY, ENEMY } from "shared/constants";
import loseImg from "components/../../public/lose.png";
import winImg from "components/../../public/win.png";
import useStyles from "hooks/useStyle";
import { Player } from "@shared/types";

const GameOverImage = ({ winner }: { winner: Player | null }) => {
  const styles = useStyles();
  const imgSize = {
    width: styles.gameOverImageWidth,
    maxWidth: "100%",
    height: 400,
  };
  if (winner === ALLY) return <img style={imgSize} src={winImg} alt="win" />;
  if (winner === ENEMY) return <img style={imgSize} src={loseImg} alt="lose" />;
  return <>Invalid winner</>;
};

export default GameOverImage;
