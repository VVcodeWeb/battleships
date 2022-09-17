import Grid2 from "@mui/material/Unstable_Grid2";
import useStyles from "hooks/useStyle";
import React from "react";

const Background = ({ children }: { children: any }) => {
  const styles = useStyles();
  return (
    <Grid2
      container
      direction="row"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      gap={1}
      style={{
        background: `url(${styles.mainBackgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {children}
    </Grid2>
  );
};

export default React.memo(Background);
