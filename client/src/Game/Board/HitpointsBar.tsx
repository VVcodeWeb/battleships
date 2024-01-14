import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";

import { useMediaQuery } from "@mui/material";

import { FULL_HP, MAX_SHIP_PARTS, MIN_MD_WIDTH } from "shared/constants";

const HitpointsBar = ({
  numPartsDamaged,
  hidden,
}: {
  numPartsDamaged: number;
  hidden?: boolean;
}) => {
  const [completed, setCompleted] = useState<number>(FULL_HP);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const [styles] = useSpring(() => ({
    from: { width: 0 },
    to: { width: 30 },
  }));

  const calcCompleted = (val: number) =>
    Math.floor(FULL_HP - val * (FULL_HP / MAX_SHIP_PARTS));

  useEffect(
    () => setCompleted(calcCompleted(numPartsDamaged)),
    [numPartsDamaged]
  );

  const containerStyles: React.CSSProperties = {
    height: isWiderMD ? 250 : 30,
    width: isWiderMD ? 30 : 300,
    backgroundColor: "transparent",
    borderTop: isWiderMD ? "1px solid white" : undefined,
    borderBottom: "1px solid white",
    borderRight: "1px solid white",
    borderLeft: !isWiderMD ? "1px solid white" : undefined,
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

  if (hidden) return <></>;
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
export default HitpointsBar;
