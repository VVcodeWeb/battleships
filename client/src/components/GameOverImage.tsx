import { useMediaQuery } from "@mui/material";
import { ALLY, ENEMY, MIN_MD_WIDTH } from "constants/const";
import { Player } from "Game/types";
import loseImg from "components/../../public/lose.png";
import winImg from "components/../../public/win.png";
const GameOverImage = ({ winner }: { winner: Player | null }) => {
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const imgSize = {
    width: isWiderMD ? 500 : 350,
    maxWidth: "100%",
    height: 400,
  };
  if (winner === ALLY) return <img style={imgSize} src={winImg} alt="win" />;
  if (winner === ENEMY) return <img style={imgSize} src={loseImg} alt="lose" />;
  return <>Invalid winner</>;
};

export default GameOverImage;
