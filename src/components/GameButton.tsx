import { HearingDisabledRounded } from "@mui/icons-material";
import { Button, useMediaQuery } from "@mui/material";
import { MIN_MD_WIDTH } from "constants/const";
import { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";

const GameButton = ({
  text,
  onClick,
  hidden,
}: {
  text: string;
  onClick: (e?: any) => void;
  hidden?: boolean;
}) => {
  const [disable, setDisabled] = useState<boolean>(false);
  const isWiderMD = useMediaQuery(MIN_MD_WIDTH);

  const handleClick = () => {
    setDisabled(true);
    onClick();
    setTimeout(() => {
      setDisabled(false);
    }, 100);
  };

  const [styles, api] = useSpring(
    () => ({
      from: {
        opacity: 0,
        transform: hidden ? "translate3d(0, -30px, 0)" : "translate3d(0, 0, 0)",
      },
      to: {
        opacity: !hidden ? 1 : 0,
        transform: "translate3d(0, 0, 0)",
      },
    }),
    [hidden]
  );
  return (
    <animated.div style={styles}>
      <Button
        variant="contained"
        className="gameButton"
        onClick={handleClick}
        disabled={hidden || disable}
        style={{
          borderRadius: 20,
          background: "#ffb562",
          fontWeight: "bold",
        }}
      >
        {text}
      </Button>
    </animated.div>
  );
};

export default GameButton;
