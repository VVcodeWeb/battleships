import { Button } from "@mui/material";
import { useState } from "react";
import { animated, useSpring } from "react-spring";

const GameButton = ({
  text,
  onClick,
  hidden,
  disabled,
}: {
  text: string;
  onClick: (e?: any) => void;
  hidden?: boolean;
  disabled?: boolean;
}) => {
  const [bounced, setBounced] = useState<boolean>(false);

  const handleClick = () => {
    setBounced(true);
    onClick();
    setTimeout(() => {
      setBounced(false);
    }, 300);
  };

  const [styles] = useSpring(
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
        disabled={hidden || bounced || disabled}
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
