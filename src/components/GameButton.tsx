import { Button } from "@mui/material";
import { useState } from "react";
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

  const handleClick = () => {
    setDisabled(true);
    onClick();
    setTimeout(() => {
      setDisabled(false);
    }, 100);
  };
  const [styles] = useSpring(() => ({
    config: {
      duration: 1000,
    },
    from: {
      opacity: 0,
      transform: "translateY(0)",
    },
    to: {
      opacity: 1,
      transfrom: "translateY(0)",
    },
  }));
  return (
    <animated.div style={{ ...styles, textAlign: "center" }}>
      <Button
        variant="contained"
        className="gameButton"
        onClick={handleClick}
        disabled={hidden || disable}
        style={{
          opacity: hidden ? 0 : 1,
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
