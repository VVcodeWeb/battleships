import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { animated, useSpring } from "react-spring";
import { useState } from "react";

import backgroundMulti from "components/../../public/multiplayer.jpg";
import backgroundSingle from "components/../../public/background_2.jpg";
import backgroudnImg from "components/../../public/background.jpg";
import { MULTI, SINGLE } from "constants/const";

const MainPageCard = ({ title, content, onClick }: any) => {
  const [hover, setHover] = useState<boolean | null>(null);
  const onHover = (value: boolean) => setHover(value);
  const styles = useSpring({
    cancel: hover === null,
    from: {
      scale: hover || hover === null ? 1 : 1.2,
    },
    to: {
      scale: hover ? 1.2 : 1,
    },
    reset: !hover,
  });
  const boxShadow = {
    boxShadow:
      "0 .25rem 2.75rem rgba(32,17,46,.2),0 1.125rem 2.25rem -1.125rem rgba(0,0,0,.24),0 1.875rem 3.75rem -.625rem rgba(0,0,0,.16)",
  };

  const cardStyle: React.CSSProperties = {
    width: 300,
    ...boxShadow,
    backgroundSize: "contain",
    height: 200,
    fontWeight: "bold",
    color: "#7a394f",
    textAlign: "center",
    fontSize: 20,
    position: "relative",
  };
  return (
    <Card
      elevation={3}
      variant="elevation"
      onMouseOver={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onClick={onClick}
      style={cardStyle}
    >
      <animated.img
        style={{
          scale: styles.scale as any,
          width: "100%",
          height: "100%",
          opacity: 0.6,
        }}
        alt="game_mode"
        src={title === MULTI ? backgroundMulti : backgroundSingle}
      />

      <CardContent
        style={{
          padding: 0,
          top: "35%",
          position: "absolute",
          width: "100%",
          fontSize: 25,
        }}
      >
        {content}
      </CardContent>
    </Card>
  );
};

const MainPage = () => {
  const nav = useNavigate();

  return (
    <Grid2
      container
      direction="row"
      height="100vh"
      style={{
        background: `no-repeat url('${backgroudnImg}')`,
        backgroundSize: "100% 100%",
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Grid2 md={4} justifyContent="center" xs={12} display="flex">
        <MainPageCard
          onClick={() => nav("/multi")}
          title={MULTI}
          content={`Compete against others`}
        />
      </Grid2>
      <Grid2 md={4} justifyContent="center" display="flex" xs={12}>
        <MainPageCard
          title={SINGLE}
          content="Play vs AI"
          onClick={() => nav("/single")}
        />
      </Grid2>
    </Grid2>
  );
};

export default MainPage;
