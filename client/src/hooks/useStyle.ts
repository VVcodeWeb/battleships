import { useMediaQuery } from "@mui/material";

import {
  MIN_MD_WIDTH,
  HEIGHT,
  SMALLER_HEIGHT,
  SMALLER_WIDTH,
  WIDTH,
  COLUMNS,
  ALLY,
  ENEMY,
} from "constants/const";
import backgroundMulti from "components/../../public/multi2.png";
import backgroundSingle from "components/../../public/background_2.jpg";
import { Player } from "Game/types";
import defaultAvatarImg from "components/../../public/default_avatar.png";

const useStyles = () => {
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);
  const singlePlayer = window.location.pathname.includes("single");
  const textShadowBoard = singlePlayer
    ? "1px 1px 1px black"
    : "1px 1px 1px white";

  const textColorBoard = singlePlayer ? "white" : "#2385C3";

  const tilesHeight = isWiderMD ? HEIGHT : SMALLER_HEIGHT;
  const tilesWidth = isWiderMD ? WIDTH : SMALLER_WIDTH;

  const distanceShipTile = !isWiderMD ? -5 : 0;

  const boardWidth = isWiderMD ? COLUMNS * WIDTH : COLUMNS * SMALLER_WIDTH;
  const playGroundJustify = isWiderMD ? "center" : "start";
  const boardJustify = isWiderMD ? "center" : "start";
  const mainColor = singlePlayer ? "#ffb562" : "#2ca7f4";

  const mainBackgroundImage = singlePlayer ? backgroundSingle : backgroundMulti;

  const gameOverImageWidth = isWiderMD ? 500 : 350;

  const getPlayerIcon = (player: Player) => {
    if (player === ALLY) return defaultAvatarImg;
    if (player === ENEMY) return;
  };

  return {
    textShadowBoard,
    textColorBoard,
    tilesHeight,
    tilesWidth,
    distanceShipTile,
    boardWidth,
    playGroundJustify,
    boardJustify,
    mainColor,
    mainBackgroundImage,
    gameOverImageWidth,
  };
};

export default useStyles;
