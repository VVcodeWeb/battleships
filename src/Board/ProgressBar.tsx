import { useMediaQuery } from "@mui/material";
import {
  BOT,
  FULL_HP,
  HUMAN,
  MAX_SHIP_PARTS,
  MIN_MD_WIDTH,
} from "constants/const";
import { useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { GameContext } from "SinglePlayer/context/GameContext";

const ProgressBar = ({ enemy }: { enemy: boolean }) => {
  const [completed, setCompleted] = useState<number>(FULL_HP);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);
  const { gameLog } = useContext(GameContext);

  const [styles, api] = useSpring(() => ({
    from: { width: 0 },
    to: { width: 30 },
  }));

  const calcCompleted = (val: number) =>
    Math.floor(FULL_HP - val * (FULL_HP / MAX_SHIP_PARTS));
  useEffect(() => {
    let numHits;
    if (enemy) {
      numHits = gameLog.filter(
        (log) => log.player === HUMAN && log.success
      ).length;
    } else {
      numHits = gameLog.filter(
        (log) => log.player === BOT && log.success
      ).length;
    }
    setCompleted(calcCompleted(numHits));
  }, [enemy, gameLog]);

  const containerStyles: React.CSSProperties = {
    height: isWiderMD ? 250 : 30,
    width: isWiderMD ? 30 : 300,
    backgroundColor: "transparent",
    borderTop: isWiderMD ? "1px solid white" : undefined,
    borderBottom: "1px solid white",
    borderRight: "1px solid white",
    borderLeft: isWiderMD ? "1px solid white" : undefined,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
  };

  const fillerStyles: React.CSSProperties = {
    width: isWiderMD ? "100%" : `${completed}%`,
    height: isWiderMD ? `${completed}%` : "100%",
    transition: "all 0.7s ease",
    backgroundColor:
      completed > 70 ? "green" : completed > 40 ? "#E1C16E" : "red",
    borderRadius: "inherit",
    textAlign: "right" as "right",
  };

  const labelStyles: React.CSSProperties = {
    padding: 5,
    color: "white",
  };

  return (
    <animated.div style={styles}>
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{completed}</span>
        </div>
      </div>
    </animated.div>
  );
};
export default ProgressBar;
