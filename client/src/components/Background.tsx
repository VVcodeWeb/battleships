import Grid2 from "@mui/material/Unstable_Grid2";
import useStyles from "hooks/useStyle";

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
      }}
    >
      {children}
    </Grid2>
  );
};

export default Background;
