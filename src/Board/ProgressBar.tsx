import { BOT, HUMAN, MAX_SHIP_PARTS } from "constants/const";
import { useContext, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { GameContext } from "SinglePlayer/context/GameContext";

const ProgressBar = ({ enemy }: { enemy: boolean }) => {
  const [completed, setCompleted] = useState<number>(100);
  const [styles, api] = useSpring(() => ({
    from: { width: 0 },
    to: { width: 30 },
  }));
  const { gameLog } = useContext(GameContext);

  const calcCompleted = (val: number) =>
    Math.floor(100 - val * (100 / MAX_SHIP_PARTS));
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
    height: 250,
    width: 30,
    backgroundColor: "transparent",
    borderTop: "1px solid white",
    borderBottom: "1px solid white",
    borderRight: "1px solid white",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
  };

  const fillerStyles: React.CSSProperties = {
    width: "100%",
    height: `${completed}%`,
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
