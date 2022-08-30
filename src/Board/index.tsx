import { animated, useSpring } from "react-spring";

import Grid2 from "@mui/material/Unstable_Grid2";

const Board = ({ hidden, children }: { hidden?: boolean; children: any }) => {
  //TODO: add animations
  const [styles, api] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
  }));

  if (hidden) return <></>;
  return (
    <animated.div style={styles}>
      <Grid2
        container
        direction={{ md: "row", xs: "column" }}
        justifyContent="center"
        alignItems="top"
      >
        {children}
      </Grid2>
    </animated.div>
  );
};

export default Board;
